/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'


Vue.use(Vuex);

const now = new Date();
const store = new Vuex.Store({
    state: {
        // 当前用户
        user: {
            name: 'Leeeeo',
            img: 'dist/images/Leeeeo.jpg'
        },
        // 会话列表
        sessions: [
            {
                id: 1,
                user: {
                    name: '笨笨狗',
                    img: 'dist/images/Dog.jpg'
                },
                messages: [
                    {
                        content: 'Hello，我是您的个人助理聊天机器人，笨笨狗~',
                        date: now
                    }, {
                        content: '您也可以直接叫我笨笨~',
                        date: now
                    }, {
                        content: '发送“商品推荐”，开启商品推荐功能~',
                        date: now
                    }
                ]
            },
        ],
        // 当前选中的会话
        currentSessionId: 1,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        INIT_DATA(state) {
            // localStorage.clear()

            let data = localStorage.getItem('vue-chat-session-' + store.state.user.name);
            // console.log('init_data:' + state.user.name)
            if (data) {
                // console.log(data)
                state.sessions = JSON.parse(data);
            }
        },
        // 发送消息
        SEND_MESSAGE({ sessions, currentSessionId }, content) {
            let session = sessions.find(item => item.id === currentSessionId);
            session.messages.push({
                content: content,
                date: new Date(),
                self: true
            });
            var question = content
            var uid = store.state.user.name
            var uri_base = 'http://127.0.0.1/irobot/ask?question=' + question + '&uid=' + uid
            axios.get(uri_base)
                .then(function (response) {
                    session.messages.push({
                        content: response.data.response[0],
                        date: new Date(),
                        self: false
                    });
                    // console.log(response.data.response[0]);
                })
                .catch(function (error) {
                    console.log(error);
                });
            // console.log(content)

        },
        // 选择会话
        SELECT_SESSION(state, id) {
            state.currentSessionId = id;
        },
        // 搜索
        SET_FILTER_KEY(state, value) {
            state.filterKey = value;
        }
    }
});

store.watch(
    (state) => state.sessions,
    (val) => {
        console.log('CHANGE: ', val);
        localStorage.setItem('vue-chat-session-' + store.state.user.name, JSON.stringify(val));
    },
    {
        deep: true
    }
);

export default store;
export const actions = {
    initData: ({ dispatch }) => dispatch('INIT_DATA'),
    sendMessage: ({ dispatch }, content) => dispatch('SEND_MESSAGE', content),
    selectSession: ({ dispatch }, id) => dispatch('SELECT_SESSION', id),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value)
};