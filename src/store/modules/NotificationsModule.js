import axios from "../../plugins/axios";

export default {
  state: {
    createdAt: null,
    notifications: [],
    notifCount: 0
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
    },
    INIT_NOTIF_COUNT(state, notifCount) {
      state.notifCount = notifCount;
    },
    INCR_NOTIF_COUNT(state) {
      state.notifCount++;
    }
  },
  actions: {
    getNotifications(context) {
      let path = `/notifications`;
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
    },
    initNotifsCount(context, { notifsCount }) {
      context.commit("INIT_NOTIF_COUNT", notifsCount);
    },
    incrNotifCount(context) {
      context.commit("INCR_NOTIF_COUNT");
    }
  }
};