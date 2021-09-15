import axios from "../../plugins/axios";

export default {
  state: {
    createdAt: null,
    notifications: []
  },
  getters: {
    notifications: state => state.notifications
  },
  mutations: {
    INIT_NOTIFICATIONS(state, payload) {
      state.notifications.push(...payload);
    },
    REMOVE_NOTIFICATION(state, index) {
      state.notifications.splice(index, 1);
    },
    ADD_NOTIFICATION(state, conv) {
      state.notifications.unshift(conv);
    }
  },
  actions: {
    getNotifications(context) {
      let path = `/Notifications`;
      if (context.state.createdAt)
        path += `?createdAt=${context.state.createdAt}`;
      return new Promise((resolve, reject) => {
        axios
          .get(path)
          .then(res => {
            if (res.data.length) {
              let lastNotif = res.data[res.data.length - 1];
              context.state.createdAt = lastNotif.createdAt;
              context.commit("INIT_NOTIFICATIONS", res.data);
            }
            resolve(res.data);
          })
          .catch(err => reject(err));
      });
    }
  }
};
