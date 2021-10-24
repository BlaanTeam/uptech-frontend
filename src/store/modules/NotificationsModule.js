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
      el.style.transition = "all 0.5s ease-in-out";
      el.setAttribute("data-delete", "true");
      setTimeout(() => {
        el.remove();
        const index = state.notifications.indexOf(notif);
        state.notifications.splice(index, 1);
      }, 500);
    },
    ADD_NOTIFICATION(state, notif) {
      state.notifications.unshift(notif);
    },
    INIT_NOTIFS_COUNT(state, notifCount) {
      state.notifCount = notifCount;
    },
    INCR_NOTIFS_COUNT(state) {
      state.notifCount++;
    },
    DECR_NOTIFS_COUNT(state) {
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
    async removeNotifs(context) {
      try {
        await axios.delete("/notifications/");
        context.state.notifications.forEach(notif => {
          context.commit("REMOVE_NOTIFICATION", notif);
        });
        context.commit("INIT_NOTIFS_COUNT", 0);
      } catch (err) {
        console.log(err);
      }
    },
    removeNotif(context, notif) {
      return new Promise((resolve, reject) => {
        axios
          .delete("/notifications/" + notif._id)
          .then(async res => {
            await context.commit("REMOVE_NOTIFICATION", notif);
            resolve(res);
          })
          .catch(err => reject(err));
      });
    },
    initNotifsCount(context, { notifsCount }) {
      context.commit("INIT_NOTIFS_COUNT", notifsCount);
    },
    incrNotifsCount(context) {
      context.commit("INCR_NOTIFS_COUNT");
    },
    decrNotifsCount(context) {
      context.commit("DECR_NOTIFS_COUNT");
    },
    addNotif(context, payload) {
      if (context.state.notifsLoaded)
        context.commit("ADD_NOTIFICATION", payload);
    }
  }
};
