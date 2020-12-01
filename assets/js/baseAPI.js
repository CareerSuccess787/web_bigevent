// 注意： 每次调用$.get() / $.post() 或$.ajax() 会先调用下面这个ajaxPrefilter函数
// Prefilter[pri:'filtə]前置滤波器
// 这个函数中可以拿到我们给ajax提供的配置对象
// 这个options就是调用ajax时传递回来的配置对象
$.ajaxPrefilter(function(options) {

    // 在发起真正的ajax请求之前， 统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // console.log(options.url);

    // 统一为有权限的接口，设置headers请求头
    // indexOf() 数组中查找给定元素的第一个索引， 如果存在就返回索引号， 不存在就返回 - 1
    // 如果地址里有/my/就给一个请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            // 要是有值就获取token 没有就给一个空值
            // localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去删除。localStorage 属性是只读的。
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete 回调函数
    // 无论成功还是失败最终都会调用这个complete回调函数
    options.complete = function(res) {
        // console.log('执行了 complete回调函数：');
        // console.log(res);
        // 在这个回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据 (response响应)
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空'token'
            localStorage.removeItem('token')

            // 2.强制跳转到登录页
            location.href = '/login.html'
        }
    }
})