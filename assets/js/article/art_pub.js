$(function() {
    initCate()
    initEditor()
        // 定义加载文章分类的方法
    function initCate() {
        // 发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var str = template('tpl-cate', res)
                $('#cate_id').html(str)

                // 一定要调用 layui.form.render(),不然看不到任何可选项(这个form和layer是同级。他俩都是layui下的)
                layui.form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面按钮添加点击事件，在点击事件中模拟input的点击事件
    $('#btnChooseImage').on('click', function(e) {
        $('#coverFile').click()
    })

    // 监听文件上传的表单change事件，获取用户选择的图片
    $('#coverFile').on('change', function(e) {
        console.log(e);
        // 1. 判断用户是否选择了文件，如果没有选择直接return出去
        if (e.target.files.length === 0) {
            return
        }
        // 2.如果选择了图片点击确定，根据文件，创建对应的URL地址
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })





    // 定义文章的发布状态（假设一个已发布的值。草稿的时候就变成草稿）
    var art_state = "已发布"

    // 为'存为草稿'按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        // 把发布状态转为草稿
        art_state = "草稿"
    })




    // 发布文章
    // 为表单绑定submit提交事件
    // 发起ajax请求，提交数据
    $('#form-pub').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()

        // 基于form表单，快速创建一个FormData对象（在ajax里讲过:Ajax操作旺旺用来提交表单数据，为了方便表单处理，H5新增了一个FormData对象，可以模拟表单操作)
        // $(this)[0]通过这种形式把jQuery对象转换为原声的DOM元素（就是把表单给FormData了）
        var fd = new FormData($(this)[0])

        // 将文章的发布状态， 存到FormData中；state是后台给的参数名，art_state是咱们目前的状态（可以看下文档有写）
        // 表格里有title,cate_id,content这三个参数，但是没有state。所以我们创建一个。然后给他追加到表格里
        fd.append('state', art_state)

        // 遍历FormData.用V接受值（value），用K接受键 （这个没啥用。就是看一下fd里都有啥
        // fd.forEach(function(v, k) {
        //         console.log(v); //我是标题,1,你好吗,已发布  得到这四个  和k 正好相呼应
        //         console.log(k); // title,cate_id,content,state  这四个
        //     })


        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })


    // 定义一个发布文章的方法，然后在提交表单的时候调用
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是FormData格式的数据，必须添加以下两个配置项（如果不加这两个属性就会请求失败）
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('发布成功')

                // 文章发布成功后，跳转到文章列表页面
                location.href = '/article/ar_list.html'

            }
        })
    }














})