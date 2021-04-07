import Vue from "vue";

export default {
  state: {
    currentConversationId: 1,
    conversations: [
      {
        id: 0,
        name: "Bill",
        text: "Hey Jing, want to give a Flux talk at ForwardJS?",
        timestamp: new Date("December 17, 2020 03:24:00")
          .toTimeString()
          .slice(0, 5)
      },
      {
        id: 1,
        name: "jhon",
        text: "Seems like a pretty cool conference.",
        timestamp: new Date("December 17, 2020 12:05:00")
          .toTimeString()
          .slice(0, 5)
      },
      {
        id: 2,
        name: "Dave",
        text: "Sounds good.  Will they be serving dessert?",
        timestamp: new Date("December 17, 2020 09:30:00")
          .toTimeString()
          .slice(0, 5)
      }
    ],
    messages: [
      {
        id: 1,
        name: "Bill",
        messages: [
          {
            received: "Hi, my name's Rich. What's your name?",
            sent: "How do you do. My name's Peter"
          },
          {
            received:
              "Nice to meet you. I'm from the United States and I live in San Diego in California. Where are you from?",
            sent: "I'm from Cologne, Germany. What's your job?"
          },
          {
            received:
              " I'm a teacher and I work online every day. What do you do?",
            sent:
              " That's interesting. I'm a bank teller. What do you like doing in your free time?"
          },
          {
            received:
              "I like playing golf and tennis in my free time. How about you?",
            sent:
              " I enjoy reading and hiking on the weekends. What are you doing now?"
          }
        ]
      },
      {
        id: 2,
        name: "Bill",
        messages: [
          {
            received: "Hi, my name is Steve. It's nice to meet you.",
            sent: "I'm Jack. It's a pleasure to meet you, Steve."
          },
          {
            received: "What do you do for a living Jack?",
            sent: "I work at the bank."
          },
          { received: "What is your name?", sent: "Jackson." },
          { received: "What was that again?" },
          {
            received: "Hey John, how have you been?",
            sent:
              "What a surprise. I haven't seen you in a long time. How have you been?"
          },
          {
            received: "I'm doing very well. How about you?",
            sent:
              "I finally have some free time. I just finished taking a big examination, and I'm so relieved that I'm done with it."
          }
        ]
      },
      {
        id: 3,
        name: "Bill",
        messages: [
          {
            received: "Hi, how are you doing?",
            sent: "I'm doing great. How about you?"
          },
          {
            received: "Not too bad.",
            sent: "Do you come to this restaurant often?"
          },
          {
            received:
              "I've been here a couple of times, but I don't come on a regular basis. What have you been up to?",
            sent:
              "I'm pretty busy at work these days, but otherwise, everything is great."
          },
          { received: "Well, have a good evening.", sent: "You too" }
        ]
      }
    ]
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
  mutations: {},
  actions: {
    changeConversation(context, payload) {
      context.state.currentConversationId = payload.id;
    }
  }
};
