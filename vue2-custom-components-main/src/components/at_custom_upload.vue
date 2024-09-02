<template>
    <div class="components-upload">
      <div class="upload-content">
        <a-upload 
          :list-type="_list_type" 
          :file-list="fileList"
          :customRequest="customUpload" 
          :remove="customRemove"
          :multiple="_multiple"
          @preview="customPreview"
        >
          <div v-if="fileList.length < _limit && _list_type == 'picture-card'">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传</div>
          </div>
          <a-button v-if="fileList.length < _limit && _list_type == 'text'"> 
            <a-icon type="upload" /> 上传 
          </a-button>
        </a-upload>
      </div>
      <div class="upload-notice" v-if="_notice">{{ _notice }}</div>
    </div>
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
  export default {
    components: {},
    props: {
      value:{}, // v-model会传递过来为vale的参数
      _limit: {
        default() {
          return 1
        }
      },
      _multiple:{
        default() {
          return false
        }
      },
      _list_type: {
        default() {
          return "picture-card" 
        }
      },
      _notice: {
        default() {
          return null
        }
      },
    },
    data() {
      return {
        fileList:[]
      }
    },
    watch: {
      fileList(nval,oval){
        this.$emit('input',nval); // 传递input事件就会给外部v-model传值
      }
    },
    created() { },
    methods: {
      async customUpload(e){
        const url = this._list_type == 'picture-card' ? await getBase64(e.file) : ''
        const uid = e.file.uid
        const name = e.file.name
        const status = 'done'
        this.fileList.push({
          uid,name,status,url,thumbUrl:url,file:e.file
        })
      },
      customRemove(v){
        const data = this.fileList.filter( item => item.uid != v.uid)
        this.fileList = data;
      },
      customPreview(v){
        if(this._list_type == 'text') return false;
  
        const img = new Image();
        img.src = v.url;
        const newWin = window.open("", "_blank");
        newWin.document.write(img.outerHTML);
      }
    },
  }
  
  </script>
  <style scoped lang="less">
  .upload-content{
    margin-bottom: 4px;
  }
  .upload-notice{
    line-height: normal;
  }
  </style>