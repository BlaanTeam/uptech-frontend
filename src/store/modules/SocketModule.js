export default {
  mutations: {
    SOCKET_connect: state => {
      console.log("Socket Connected !");
    },
    SOCKET_connect_error: (state, err) => {
      console.log(err);
    }
  }
};
