$(function() {
        // 点击“去注册账号”的链接
        $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })

        // 点击“去登录”的链接
        $('#link_login').on('click', function() {
            $('.reg-box').hide()
            $('.login-box').show()
        });


        // 表单预校验
        // 从layui中获取form对象   
        var form = layui.form;    
        var layer = layui.layer

        // 通过form.verify()方法来校验规则
        // 自定义了一个叫pwd的校验规则（校验密码）
        form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],


            // 校验两次密码是否一致
            // 1.通过形参那到底的是确认密码框中的内容
            repwd: function(value) {
                // 属性选择器 类名和属性之间必须有空格，不然就不能用
                // 2.拿到密码框中的内容
                var pwd = $('.reg-box [name=password]').val()
                    // 3.判断密码框和确认密码框内的内容是否一致。如果失败，提示消息
                if (pwd !== value) { return '两次密码输入不一致' }

            }

        });
        // 侦听注册表单的提交事件  
        $('#form_reg').on('submit',  function(e)  {       
            // 1.阻止表单的默认行为 
            e.preventDefault();  
            var data = {
                    username: $('#form_reg [name=username]').val(),
                    password: $('#form_reg [name=password]').val()
                } 
                // 发起post请求  
            $.post('/api/reguser', data,
                function(res) {
                    // 这个必须写res.message，因为这里有很多失败的原因都会反馈到这里
                    if (res.status !== 0) { return layer.msg(res.message); }
                    layer.msg('注册成功');
                    $('#link_login').click()
                })  
        })

        // 侦听登录表单的提交事件
        $('#form_login').submit(function(e) {
            // 1.阻止登录表单的提交事件
            e.preventDefault()

            // 2.发起ajax请求（这里只是用不同的方法来练习一下。跟上面方式一样也行）
            $.ajax({
                url: '/api/login',
                method: 'POST',
                // 这个this只的就是当前的这个$('#form_login')登录表单
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) { return layer.msg(res.message) }
                    layer.msg('登录成功');
                    // 将登录成功得到的token字符串，保存到locaStorage中
                    localStorage.setItem('token', res.token)
                        // 3.如果成功，跳转到登录主页
                    location.href = '/index.html'

                }
            })
        })




    }) // end