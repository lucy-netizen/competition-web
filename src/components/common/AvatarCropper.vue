<template>
  <div>
    <!-- 修复 Vue Prop 警告：去掉 .sync 装饰器，采用单向绑定 -->
    <el-dialog
        :title="title"
        :visible="visible"
        width="800px"
        append-to-body
        @opened="modalOpened"
        @close="closeDialog"
    >
      <el-row>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <vue-cropper
              ref="cropper"
              :img="options.img"
              :info="true"
              :autoCrop="options.autoCrop"
              :autoCropWidth="options.autoCropWidth"
              :autoCropHeight="options.autoCropHeight"
              :fixedBox="options.fixedBox"
              :outputType="options.outputType"
              @realTime="realTime"
              v-if="visible"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :sm="3" :xs="3">
          <el-upload
              action="#"
              :http-request="requestUpload"
              :show-file-list="false"
              :before-upload="beforeUpload"
          >
            <el-button size="small">
              选择
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{span: 1, offset: 2}" :sm="2" :xs="2">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{span: 2, offset: 6}" :sm="2" :xs="2">
          <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
import { uploadFileApi } from '@/api/file'
import { updateProfileApi } from '@/api/user'

export default {
  components: { VueCropper },
  props: {
    // 当前登录用户信息
    user: {
      type: Object,
      default: () => ({})
    },
    // 控制弹窗显示
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: "修改头像",
      options: {
        img: null,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true,
        outputType: "png"
      },
      previews: {},
      resizeHandler: null
    };
  },
  watch: {
    // 当打开弹窗时，初始化裁剪器图片
    visible(newVal) {
      if (newVal && this.user) {
        this.options.img = this.user.avatar;
      }
    },
  },
  methods: {
    /** 弹出层打开后的回调 */
    modalOpened() {
      if (!this.resizeHandler) {
        this.resizeHandler = () => {
          this.refresh();
        };
      }
      window.addEventListener("resize", this.resizeHandler);
    },
    /** 刷新裁剪器 */
    refresh() {
      if (this.$refs.cropper) {
        this.$refs.cropper.refresh();
      }
    },
    /** 覆盖默认上传行为 */
    requestUpload() {
      // 仅作为占位，实际逻辑在 beforeUpload 和 uploadImg 中
    },
    /** 向左旋转 */
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    /** 向右旋转 */
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    /** 缩放图片 */
    changeScale(num) {
      this.$refs.cropper.changeScale(num || 1);
    },
    /** 上传前的校验与本地读取 */
    beforeUpload(file) {
      // 1. 格式校验
      const isImg = file.type.indexOf("image/") !== -1;
      if (!isImg) {
        this.$message.error("文件格式错误，请上传 JPG/PNG 等格式的图片文件。");
        return false;
      }
      // 2. 大小校验：限制 2MB
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }

      // 3. 读取文件到裁剪器
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.options.img = reader.result;
      };
      return false; // 返回 false 停止 Element 默认的上传流
    },
    /** 核心：提交裁剪后的图片到后端 */
    async uploadImg() {
      this.$refs.cropper.getCropBlob(async data => {
        try {
          const file = new File([data], 'avatar.png', { type: 'image/png' });
          let formData = new FormData();
          formData.append("file", file);

          // 1. 调用上传物理文件接口
          const uploadRes = await uploadFileApi(formData, 'avatar');

          if (uploadRes && uploadRes.data) {
            const newAvatarUrl = uploadRes.data;

            // 2. 调用更新用户资料接口（写入数据库）
            await updateProfileApi({
              id: this.user.id,
              avatar: newAvatarUrl
            });

            // 3. 成功后的交互处理
            this.$message.success('头像更新成功');

            // 同步更新 Vuex 全局状态
            if (this.$store && this.$store.state.userInfo) {
              this.$store.state.userInfo.avatar = newAvatarUrl;
            }

            // 通知父组件
            this.$emit('update-avatar', newAvatarUrl);
            this.closeDialog();
          }
        } catch (error) {
          console.error('头像上传失败:', error);
          this.$message.error('上传失败，请检查网络或后端服务');
        }
      });
    },
    /** 实时预览功能 */
    realTime(data) {
      this.previews = data;
    },
    /** 关闭弹窗逻辑：必须通过 emit 通知父组件 */
    closeDialog() {
      this.options.img = null;
      window.removeEventListener("resize", this.resizeHandler);
      // 关键：Vue 规范要求子组件不能直接修改 Prop，必须通知父组件修改
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style scoped lang="scss">
.avatar-upload-preview {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  // 确保图片在圆圈内显示完整
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>