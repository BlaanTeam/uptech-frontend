import axios from "../../plugins/axios";

let handleConvs = (context, convId, user, lastMessage) => {
  let convIndex = context.state.convIds.get(convId);

  if (convIndex === undefined) {
    let conv = {
      _id: convId,
      lastMessage: lastMessage,
      timestamp: Date.now(),
      user
    };
    context.commit("ADD_CONVERSATION", conv);
  } else if (convIndex === 0) {
    context.state.conversations[convIndex].lastMessage = lastMessage;
    context.state.conversations[convIndex].timestamp = Date.now();
  } else {
    let conv = context.state.conversations[convIndex];
    conv.lastMessage = lastMessage;
    conv.timestamp = Date.now();
    context.commit("REMOVE_CONVERSATION", convIndex);
    context.commit("ADD_CONVERSATION", conv);
  }
};

export default {
  state: {
    createdAt: null,
    convIds: new Map(),
    conversations: []
  },
  getters: {
    conversations: state => state.conversations
  },
  mutations: {
    INIT_CONVERSATIONS(state, payload) {
      state.conversations.push(...payload);
    },
    REMOVE_CONVERSATION(state, index) {
      state.conversations.splice(index, 1);
    },
    ADD_CONVERSATION(state, conv) {
      state.conversations.unshift(conv);
    },
    ADD_CONV_ID(state, payload) {
      state.convIds.set(payload._id, payload.index);
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
    async receiveMessage(context, { convId, user, lastMessage }) {
      handleConvs(context, convId, user, lastMessage);
    },
    generateConvIds(context, payload) {
      context.commit("ADD_CONV_ID", payload);
    }
  }
};
