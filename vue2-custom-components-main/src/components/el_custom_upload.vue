<template>
    <el-upload
    v-show="false"
      action=" "
      multiple
      :auto-upload="false"
      :show-file-list="false"
      :on-change="customUpload"
    >
      <div></div>
    </el-upload>
  </template>
  
  <script>
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    })
  }
  function isImage(filePath) {
    let index= filePath.lastIndexOf(".");// 获取最后一个.的位置
    let ext = filePath.substr(index+1);// 获取后缀
    const img_type_arr = [ 'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
    return img_type_arr.indexOf(ext.toLowerCase()) !== -1;
  }
  export default {
      props: {
        value:{}, // v-model会传递过来为vale的参数
      },
      data() {
        return {
  
        };
      },
      methods: {
        async customUpload(file){
          if(isImage(file.name)){
            file.preview = await getBase64(file.raw)
          }else{
            file.preview = ''
          }
          this.$emit('input',file); // 传递input事件就会给外部v-model传值
        }
      }
    }
  
  </script>
  <style scoped></style>