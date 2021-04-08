import axios from "../../plugins/axios";

export default {
  state: {
    currentConversationId: 1,
    conversations: []
  },
  getters: {
    conversations: state => state.conversations,
    currentConversation: state =>
      state.conversations[state.currentConversationId],
    currentMessages: (state, { currentConversation }) => {
      const conversation = currentConversation.id;
      return state.messages[conversation].messages;
    }
  },
  mutations: {
    INIT_CONVERSATIONS(state, payload) {
      state.conversations = payload;
    },
    REMOVE_CONVERSATION(state, index) {
      state.conversations.splice(index, 1);
    },
    ADD_CONVERSATION(state, conv) {
      state.conversations.unshift(conv);
    }
  },
  actions: {
    changeConversation(context, payload) {
      context.state.currentConversationId = payload.id;
    },
    initiateNewConversation(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/chats`, { userId: payload._id })
          .then(res => {
            console.log(res.data);
            // if (!res.isNew) res.user = payload;
            res.data.user = payload;
            res.data.lastMessage = { content: "New Conversation" };
            context.state.conversations.unshift(res.data);
            resolve(res.data);
          })
          .catch(err => reject(err));
      });
    },
    getConversations(context) {
      return new Promise((resolve, reject) => {
        axios
          .get("/chats")
          .then(res => {
            context.commit("INIT_CONVERSATIONS", res.data);
            resolve(res.data);
          })
          .catch(err => reject(err));
      });
    },
    sendMessage(context, { convId, content }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/chats/${convId}/messages`, { content })
          .then(res => {
            let length = context.state.conversations.length;
            for (let i = 0; i < length; i++) {
              if (context.state.conversations[i]._id === convId) {
                let conv = context.state.conversations[i];
                conv.lastMessage.content = res.data.content;
                if (i === 0) break;
                context.commit("REMOVE_CONVERSATION", i);
                context.commit("ADD_CONVERSATION", conv);
                break;
              }
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
