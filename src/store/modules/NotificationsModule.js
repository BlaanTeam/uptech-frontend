import axios from "../../plugins/axios";

export default {
  state: {
    createdAt: null,
    notifications: [],
    notifCount: 0,
    notifsLoaded: false
  },
  getters: {
    notifications: state => state.notifications,
    notifCount: state => state.notifCount
  },
  mutations: {
    INIT_NOTIFICATIONS(state, payload) {
      state.notifications.push(...payload);
    },
    REMOVE_NOTIFICATION(state, notif) {
      const el = document.querySelector("#notif" + notif._id);
      el.setAttribute("data-delete", "true");
      el.style.transition = "all 0.5s ease-in-out";
      setTimeout(() => {
        el.remove();
        const index = state.notifications.indexOf(notif);
        if (state.notifications.length && index != undefined)
          state.notifications.splice(index, 1);
      }, 500);
    },
    ADD_NOTIFICATION(state, notif) {
      state.notifications.unshift(notif);
    },
    INIT_NOTIF_COUNT(state, notifCount) {
      state.notifCount = notifCount;
    },
    INCR_NOTIF_COUNT(state) {
      state.notifCount++;
    },
    DECR_NOTIF_COUNT(state) {
      state.notifCount--;
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
            context.state.notifsLoaded = true;
            resolve(res.data);
          })
          .catch(err => reject(err));
      });
    },
    async removeNotif(context, notif) {
      await axios.delete("/notifications/" + notif._id);
      context.commit("REMOVE_NOTIFICATION", notif);
    },
    initNotifsCount(context, { notifsCount }) {
      context.commit("INIT_NOTIF_COUNT", notifsCount);
    },
    incrNotifsCount(context) {
      context.commit("INCR_NOTIF_COUNT");
    },
    decrNotifsCount(context) {
      context.commit("DECR_NOTIF_COUNT");
    },
    addNotif(context, payload) {
      if (context.state.notifsLoaded)
        context.commit("ADD_NOTIFICATION", payload);
    }
  }
};
