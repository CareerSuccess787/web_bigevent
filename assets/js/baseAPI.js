// 注意： 每次调用$.get() / $.post() 或$.ajax() 会先调用下面这个ajaxPrefilter函数
// Prefilter[pri:'filtə]前置滤波器
// 这个函数中可以拿到我们给ajax提供的配置对象
// 这个options就是调用ajax时传递回来的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax请求之前， 统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
})