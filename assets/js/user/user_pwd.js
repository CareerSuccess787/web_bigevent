$(function() {
        var form = layui.form

        // 自定义校验规则
        form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            // 这个value就是新密码
            samePwd: function(value) {
                if (value === $('[name=oldPwd]').val()) {
                    return '新旧密码不能相同!'
                }
            },
            // 这个value是再次确认的密码，因为这个rePwd放到了确认密码上
            rePwd: function(value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次输入的密码不一致'
                }
            }
        })


        // 监听提交表单
        $('.layui-form').on('submit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault()
                // 发起ajax请求
            $.ajax({
                method: 'POST',
                url: '/my/updatepwd',
                // 快速获取表单数据
                data: $(this).serialize(),
                success: function(res) {
                    // 判断提交数据是否成功：失败提示：更新密码失败；成功提示：更新密码成功
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg('更新密码成功')
                        // 将jQuery元素转换为DOM元素，调用DOM中的form的reset()方法重置表单
                    $('.layui-form')[0].reset()
                }
            })
        })














    }) //end