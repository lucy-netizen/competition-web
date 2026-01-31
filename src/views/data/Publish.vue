<template>
  <div class="publish-container" style="padding: 20px; max-width: 800px; margin: 0 auto;">
    <h2>科学数据发布</h2>
    <el-card>
      <el-form
          ref="publishForm"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          label-position="left"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入科学数据标题" clearable />
        </el-form-item>

        <el-form-item label="作者" prop="authors">
          <el-input v-model="formData.authors" placeholder="多个作者以逗号分隔" clearable />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="5" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="formData.keywords" placeholder="请输入"/>
        </el-form-item>

        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="formData.categoryId" style="width: 100%" >
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-select v-model="formData.tags" style="width: 100%" multiple >
            <el-option v-for="item in tagOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="引用文献" prop="citation">
          <el-input v-model="formData.citation" type="textarea" :rows="3" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="CSTR编号">
          <el-input v-model="formData.cstr" clearable placeholder="选填" />
        </el-form-item>

        <el-form-item label="DOI编号">
          <el-input v-model="formData.doi" clearable placeholder="选填" />
        </el-form-item>

        <el-form-item label="下载连接" prop="externalLink">
          <el-input v-model="formData.externalLink" clearable placeholder="请输入外部链接（如网盘或官网链接）" />
        </el-form-item>

        <el-form-item label="是否最近动态">
          <el-switch v-model="formData.latestUpdates" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否首页轮播">
          <el-switch v-model="formData.carousel" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否重点关注">
          <el-switch v-model="formData.spotlight" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="数据文件" prop="dataUrl">
          <div class="upload-wrapper">
            <el-upload
                :action="apiBaseUrl + '/api/sci-data/upload'"
                name="file"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
                class="custom-upload"
            >
              <el-button type="primary" size="small">点击上传数据文件</el-button>
            </el-upload>
            <div class="upload-tip">选填。支持任意文件格式，大小不超过 500MB</div>
            <div v-if="formData.file_name" class="upload-success-tip">
              文件已上传：<span>{{ formData.file_name }}</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="缩略图" prop="thumbnailUrl">
          <div class="upload-wrapper">
            <el-upload
                class="custom-upload"
                :action="apiBaseUrl + '/api/sci-data/upload-thumbnail'"
                name="file"
                :show-file-list="false"
                :on-success="handleThumbnailUploadSuccess"
                :before-upload="beforeThumbnailUpload"
                accept="image/*"
            >
              <el-button type="primary" size="small">点击上传缩略图文件</el-button>
            </el-upload>
            <div class="upload-tip">支持 JPG/PNG，大小不超过 2MB</div>
            <div v-if="formData.thumbnailUrl" class="preview-container" style="margin-top: 15px;">
              <p style="font-size: 12px; color: #67c23a; margin-bottom: 5px;">图片预览：</p>
              <img
                  :src="formData.thumbnailUrl"
                  style="width: 150px; height: 100px; object-fit: cover; border: 1px solid #ebeef5; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="submitForm" :loading="submitLoading">提交发布</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import axios from 'axios'

export default {
  name: 'Publish',
  data() {
    return {
      submitLoading: false,
      apiBaseUrl: 'http://localhost:8800',
      categoryOptions: [
        { label: '行星科学', value: 'planetary_science' },
        { label: '卫星遥感', value: 'satellite_remote_sensing' },
        { label: '地球物理', value: 'geophysics' },
        { label: '气候气象', value: 'climate_meteorology' },
        { label: '海洋科学', value: 'marine_science' }
      ],
      tagOptions: ['气候', '遥感', '卫星', '地球', '海洋', '大气', '地质'],
      formData: {
        title: '',
        authors: '',
        description: '',
        keywords: '',
        categoryId: '',
        tags: [],
        citation: '',
        cstr: '',
        doi: '',
        externalLink: '',
        dataUrl: '',
        downloadUrl: '',
        fileName: '',
        thumbnailUrl: '',
        carousel: 0,
        latestUpdates: 0,
        spotlight: 0,
        status: 0
      },
      formRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        authors: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          { min: 10, message: '描述长度不能少于 10 个字符', trigger: 'blur' }
        ],
        categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
        keywords: [
          { required: true, message: '请输入关键词', trigger: 'blur' }
        ],
        tags: [
          { required: true, message: '请选择至少一个标签', trigger: 'change' }
        ],
        citation: [
          { required: true, message: '请输入引用文献', trigger: 'blur' },
          { min: 5, message: '引用文献长度不能少于 5 个字符', trigger: 'blur' }
        ],
        //下载链接现在设为必填项，后期可根据修改增删
        /*externalLink: [
          { required: true, message: '请输入下载链接', trigger: 'blur' }
        ],*/
        //dataUrl: [{ required: true, message: '请上传数据文件', trigger: 'change' }]
      }
    }
  },
  methods: {
    beforeUpload(file) {
      if (file.size > 500 * 1024 * 1024) { Message.error('超过500MB'); return false; }
      return true;
    },
    handleUploadSuccess(res) {
      if (res.code === 200) {
        const relativePath = res.data.url;
        const fullDownloadLink = this.apiBaseUrl + relativePath;
        this.formData.dataUrl = fullDownloadLink;     // 页面展示用
        this.formData.downloadUrl = fullDownloadLink; // 存入数据库 download_url 字段
        this.formData.fileName = res.data.fileName;
        Message.success('数据文件上传成功，已生成下载连接')
      }
    },
    beforeThumbnailUpload(file) {
      const isImg = file.type.startsWith('image/');
      if (!isImg) Message.error('只能上传图片');
      return isImg;
    },
    handleThumbnailUploadSuccess(res) {
      if (res.code === 200) {
        const relativePath = res.data.url;
        const fullThumbnailUrl = this.apiBaseUrl + relativePath;
        this.formData.thumbnailUrl = fullThumbnailUrl;

        Message.success('缩略图上传成功，已更新预览');
      }
    },
    async submitForm() {
      this.$refs.publishForm.validate(async (valid) => {
        if (!valid) return;

        this.submitLoading = true;
        try {
          const payload = {
            ...this.formData,
            tags: this.formData.tags.join(','),
            carousel: this.formData.carousel ? 1 : 0,
            latestUpdates: this.formData.latestUpdates ? 1 : 0,
            spotlight: this.formData.spotlight ? 1 : 0
          };
          console.log("提交的载荷:", payload);
          const res = await axios.post(this.apiBaseUrl + '/api/sci-data/publish', payload);
          if (res.data.code === 200) {
            Message.success('发布成功');
            this.resetForm();
          } else {
            Message.error(res.data.msg || '保存失败');
          }
        } catch (e) {
          console.error(e);
          Message.error('网络错误或服务器异常');
        } finally {
          this.submitLoading = false;
        }
      });
    },
    resetForm() {
      if (this.$refs.publishForm) {
        this.$refs.publishForm.resetFields();
      }
      this.formData.cstr = '';
      this.formData.doi = '';
      this.formData.externalLink = '';//重置下载链接行
      this.$refs.publishForm.resetFields();
      this.formData.thumbnailUrl = '';
      this.formData.dataUrl = '';
      this.formData.fileName = '';
      this.formData.tags = [];
      this.formData.latestUpdates = 0;
      this.formData.spotlight = 0;

      //this.$message.info('表格已重置');
    }
  }
}
</script>

<style scoped>
.publish-container {
   font-size: 14px;
  font-family: "SimSun", "宋体", "STSong", serif;
  }
.upload-wrapper { display: flex; flex-direction: column; align-items: flex-start; }
.custom-upload .el-button { width: 160px; margin-bottom: 8px; }
.upload-tip { color: #999; font-size: 12px; }
.upload-success-tip { color: #67c23a; font-size: 13px; }
</style>