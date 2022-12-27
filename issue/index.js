marked.setOptions({
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    }
});
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
const accessToken = localStorage.getItem('github-token');
if (accessToken != undefined) {
    axios.defaults.headers.common['Authorization'] = accessToken;
}
const issueId = (new URL(document.location)).searchParams.get('id');
const app = Vue.createApp({});
app.use(ElementPlus);
for (let i in ElementPlusIconsVue) {
    app.component(i, ElementPlusIconsVue[i]);
}
app.component('md-editor', MarkdownEditor);
app.component('gutalk-issue', {
    data() {
        return {
            isLogin: accessToken != undefined,
            content: false,
            comments: false,
            commenting: false
        }
    },
    mounted() {
        if (accessToken != undefined) {
            axios.get('https://api.github.com/user').then(() => {
                this.isLogin = true;
            }).catch((err) => {
                this.isLogin = false;
                localStorage.removeItem('github-token');
                delete axios.defaults.headers.common['Authorization'];
                ElementPlus.ElMessage.error(`登录信息无效：${err}`);
            });
        }
        axios.get(`https://api.github.com/repos/gutalk-website/issue-repo/issues/${issueId}`).then((res) => {
            this.content = res.data;
        }).catch((err) => {
            ElementPlus.ElMessage.error(`获取数据失败：${err}`);
        });
        axios.get(`https://api.github.com/repos/gutalk-website/issue-repo/issues/${issueId}/comments`).then((res) => {
            this.comments = res.data;
        }).catch((err) => {
            ElementPlus.ElMessage.error(`获取数据失败：${err}`);
        });
    },
    methods: {
        marked(str) {
            return str == null ? '' : marked.parse(str);
        },
        comment(str) {
            this.commenting = true;
            axios.post(
                `https://api.github.com/repos/gutalk-website/issue-repo/issues/${issueId}/comments`,
                JSON.stringify({ 'body': str })
            ).then((res) => {
                this.comments.push(res.data);
                this.$refs.editor.clear();
                ElementPlus.ElMessage.success('发送成功！');
                this.commenting = false;
            }).catch((err) => {
                ElementPlus.ElMessage.error(`提交失败：${err}`);
                this.commenting = false;
            });
        }
    },
    template: '#issue'
})
app.mount('#app');