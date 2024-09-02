<template>
  <van-uploader v-model="image_cover" accept="image/*" max-count="1" :preview-image="false"
    :after-read="uploadImage">
    <van-button icon="photo-o" color="#A80613" size="small" style="margin-right:2vw"></van-button>
  </van-uploader>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      image_cover:[],
    }
  },
  computed: {},
  created() { },
  methods: {
    // 发送图片
    async uploadImage(){
      let pack_file = await compression(this.image_cover[0].file);
      let pack_params = await getBase64(pack_file);

      let params = this.image_cover[0].content
      this.image_cover = []
    },
  },
}

</script>
<style scoped></style>