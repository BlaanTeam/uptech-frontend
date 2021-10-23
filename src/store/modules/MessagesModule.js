import axios from "../../plugins/axios";

const handleConvs = (context, convId, user, lastMessage) => {
  const conv = context.state.conversations.find(conv => conv._id == convId);
  const index = context.state.conversations.indexOf(conv);

  if (conv && index == 0) {
    conv.lastMessage = lastMessage;
    conv.timestamp = Date.now();
    return;
  }
  if (conv && index != 0) {
    conv.lastMessage = lastMessage;
    conv.timestamp = Date.now();
    context.commit("REMOVE_CONVERSATION", conv);
    context.commit("ADD_CONVERSATION", conv);
    return;
  }

  let newConv = {
    _id: convId,
    lastMessage: lastMessage,
    timestamp: Date.now(),
    user
  };
  context.commit("ADD_CONVERSATION", newConv);
};

export default {
  state: {
    createdAt: null,
    conversations: [],
    msgsCount: 0
  },
  getters: {
    conversations: state => state.conversations,
    msgsCount: state => state.msgsCount
  },
  mutations: {
    INIT_CONVERSATIONS(state, payload) {
      state.conversations.push(...payload);
    },
    REMOVE_CONVERSATION(state, conv) {
      const index = state.conversations.indexOf(conv);
      state.conversations.splice(index, 1);
    },
    ADD_CONVERSATION(state, conv) {
      state.conversations.unshift(conv);
    },
    MARK_READ(state, convId) {
      const conv = state.conversations.find(conv => conv._id == convId);
      if (conv && !conv.lastMessage.read) conv.lastMessage.read = true;
    },
    INIT_MSGS_COUNT(state, msgsCount) {
      state.msgsCount = msgsCount;
    },
    INCR_MSGS_COUNT(state) {
      state.msgsCount++;
    }
  },
  actions: {
    initiateNewConversation(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/chats`, { userId: payload._id })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => reject(err));
      });
    },
    getConversations(context) {
      let path = `/chats`;
      if (context.state.createdAt)
        path += `?createdAt=${context.state.createdAt}`;
      return new Promise((resolve, reject) => {
        axios
          .get(path)
          .then(res => {
            if (res.data.length) {
              let lastConv = res.data[res.data.length - 1];
              context.state.createdAt = lastConv.timestamp;
              context.commit("INIT_CONVERSATIONS", res.data);
            }
            context.state.convLoaded = true;
            resolve(res.data);
          })
          .catch(err => reject(err));
      });
    },
    getMessages(context, { createdAt, convId }) {
      let path = `/chats/${convId}/messages`;
      if (createdAt) path += `?createdAt=${createdAt}`;
      return new Promise((resolve, reject) => {
        axios
          .get(path)
          .then(res => {
            resolve(res.data);
          })
          .catch(err => reject(err));
      });
    },
    sendMessage(context, { convId, content, user }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/chats/${convId}/messages`, { content })
          .then(res => {
            res.data.read = false;
            handleConvs(context, convId, user, res.data);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    async markRead(context, { convId }) {
      await context.commit("MARK_READ", convId);
    },
    async receiveMessage(context, { convId, user, lastMessage }) {
      if (context.state.convLoaded)
        handleConvs(context, convId, user, lastMessage);
    },
    initMsgsCount(context, { msgsCount }) {
      context.commit("INIT_MSGS_COUNT", msgsCount);
    },
    incrMsgsCount(context) {
      context.commit("INCR_MSGS_COUNT");
    }
  }
};
