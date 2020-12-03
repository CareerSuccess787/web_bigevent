 $(function() {


     // 1.1 获取裁剪区域的 DOM 元素
     var $image = $('#image')
         // 1.2 配置选项
     const options = {
         // 纵横比(1相当于1/1就是正方形：4/3、16/9就是扁的长方形，)
         aspectRatio: 1,
         // 指定预览区域
         preview: '.img-preview'
     }

     // 1.3 创建裁剪区域
     $image.cropper(options)

     // 给上传按钮绑定事件
     $('#btnChooseImage').on('click', function() {
         //  模拟input的点击事件
         $('#file').click()
     })

     // 为文件选择框绑定change事件（只要选择的文件发生了变化就会触发input的change事件）
     $('#file').on('change', function(e) {
         // e里的target中有一个files， 他是一个伪数组，可以当成数组去使用
         console.log(e);

         //  这块主要是要验证一下是不是上传了图片
         // 判断是否上传了文件
         if (e.target.files.length === 0) {
             return layui.layer.msg('请上传一张图片')
         }


         //  这块主要是把上传的图片到裁剪区里
         // 1.拿到图片
         var img = e.target.files[0]

         // 2.创建文件对应的url地址（将文件转化为路径）
         var newImgURL = URL.createObjectURL(img)

         // 3.把url地址赋值给裁剪区域
         $image
             .cropper('destroy') // 销毁旧的裁剪区域
             .attr('src', newImgURL) // 重新设置图片路径
             .cropper(options) // 重新初始化裁剪区域
     })

     // 为确定按钮绑定点击事件
     $('#btnUpload').click(function() {
         //  拿到用户裁剪之后的头像
         var dataURL = $image
             .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                 width: 100,
                 height: 100
             })
             .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

         // 调用接口把头像上传到服务器
         $.ajax({
             method: 'POST',
             url: '/my/update/avatar',
             data: {
                 avatar: dataURL
             },
             success: function(res) {
                 if (res.status !== 0) {
                     return layui.layer.msg(res.message)
                 }
                 layui.layer.msg(res.message)
                 window.parent.getUserInfo()
             }
         })


     })














 })