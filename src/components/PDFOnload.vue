<template>
  <div class="importPDF">
    <el-dialog
      title="PDF数据导入"
      :visible.sync = showDataImportDialog
      center
      width="35%" 
      style="left: 10%"
    >
      <div>
        <label style="font-weight: bold;margin-right: 10px;">文      件:</label>
        <el-input v-model="fileName" size="mini" style="width:52%; margin-left: 18px"></el-input>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="/pdf/upload"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button slot="trigger" size="mini" type="danger">选取文件</el-button>
        </el-upload>
          <el-form ref="pdfForm"  :model="pdfForm" >
            <el-form-item label="公告类型" style="margin-top: 10px">
              <el-select class="formItem" size="mini" placeholder="请选择公告类型" v-model="pdfForm.announcementType">
                <el-option 
                  v-for="item in announcementTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文件级别"  style="margin-top: -20px">
              <el-select class="formItem" size="mini" placeholder="请选择文件级别" v-model="pdfForm.fileLevel">
                <el-option 
                  v-for="item in fileLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        <div style="margin-top: 10px">备注：仅限上传一个PDF文件</div>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button size="mini" @click="viewfile">预览</el-button>
        <el-button size="mini" type="primary" @click="upLoadpdf()">上传</el-button>
        <el-button size="mini" @click="showDataImportDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
    }
  },
  methods: {
    //上传PDF文件之前
    beforeUpload(file){
      console.log("文件", file);
      this.file = file;
      this.fileName = file.name;
      // this.fileSize = file.size;
      const extension = file.name.split('.').slice(-1) == 'pdf'
      if (!extension) {
        this.$message.warning('上传模板只能是pdf格式!')
        return
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let that = this;
      reader.onload = function() {
        that.fileData = reader.result;
      };
      return false; // 返回false不会自动上传
    },
    //预览文件
    viewfile(){
      console.log("viewFile");
      var win = window.open();
      win.document.write(
      '<body style="margin:0px;"><object data="' +
      this.fileData +
      '" type="application/pdf" width="100%" height="100%"><iframe src="' +
      this.fileData +
      '" scrolling="no" width="100%" height="100%" frameborder="0" ></iframe></object></body>'
      );
      // win.document.write(
      //   '<body style="margin:0px;"><iframe src="' +
      //     this.fileData +
      //     '" scrolling="no" width="100%" height="100%" frameborder="0" ></iframe></body>'
      // );
    },
    //上传文件按钮
    upLoadpdf(){
      if(this.fileName === ''){
        this.$message.warning('请选择要上传的文件！');
        return false
      }
      if(this.pdfForm.announcementType === ''){
        this.$message.warning('请选择公告类型');
        return false
      }
      if(this.pdfForm.fileLevel === ''){
        this.$message.warning('请选择公告级别');
        return false
      }
      //后端需要三个参数file、announcementType、fileLevel，用fileFormData包起来防止
      // 出现 headers:  'multipart/form-data'等错误
      // 若后端只需一个参数  添加
      //  let requestConfig = {
      //headers: {
      // 'Content-Type': 'multipart/form-data'
      //},
      //}
      //this.axios.post('/market/upload',formData,requestConfig).then((res)=>          
      let fileFormData = new FormData();
      fileFormData.append("file", this.file);
      fileFormData.append('announcementType',this.pdfForm.announcementType)
      fileFormData.append('fileLevel',this.pdfForm.fileLevel)
      this.axios.post('/admin/uploadUserFile',fileFormData).then(res =>{
        if (res.data.status===1){
          this.$message({
            message:res.data.msg,
            type:'success',
            duration: 3000,
          });
          this.showDataImportDialog=false
        }else{
          this.messageLabel = this.$message({
            message:res.data.msg,
            type:'error',
            showClose:true,
            duration:0,
          });
        }
      })
    },
  }
}
</script>