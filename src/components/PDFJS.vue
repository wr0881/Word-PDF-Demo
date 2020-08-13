<template>
    <div class="page-one">
        <p style="font-weight:bold;font-size:28px;">pdf/office demo</p>
        <!--本地-->
        <div style="margin-top: 10px">
            <p style="font-size:20px;">本地</p>
            <!-- <Button @click="check">打开</Button> -->
            <Button @click="checkLocal">打开pdf</Button>
            <Button @click="checkPpt">打开ppt</Button>
            <Button @click="checkWord">打开word</Button>
        </div>
        <!--服务器-->
        <div style="margin-top:30px">
            <p style="font-size:20px;">服务器</p>
            <Button @click="checkError">查看错误PDF文件</Button>
            <Button @click="checkNormal">查看有效PDF文件</Button>
            <Button @click="checkSuccess">查看服务器跨域返回流</Button>
        </div>
        <!--下载文件-->
        <div style="margin-top:30px;">
            <p style="font-size:20px;">下载</p>
            <Button @click="downFile">下载图片</Button>
            <Button @click="downFile1">下载Word</Button>
        </div>
        <!--canvas-->
        <div style="margin-top:30px;color:#70DB55;margin-bottom: 10px">
            <Button style="font-weight:600" @click="checkContract">预览</Button>
        </div>
        <md-contract :visible="contractVisable"
            :showBtns="true"
            @handleModal="close"
        >
        </md-contract>
        <!--上传-->
        <div style="margin-top: 40px">
            <p style="font-size:20px;">上传文件</p>
            <!--<template>
                <uploader :options="options" class="uploader-example">
                    <uploader-unsupport></uploader-unsupport>
                    <uploader-drop>
                        <uploader-btn>选择文件</uploader-btn>
                        <uploader-btn :attrs="attrs">选择图片</uploader-btn>
                        <uploader-btn :directory="true">选择文件夹</uploader-btn>
                    </uploader-drop>
                    <uploader-list></uploader-list>
                </uploader>
            </template>-->
            <template>
                <button type="button" @click="click" class="oUpload">
                    <span v-if="fileName">重新上传</span>
                    <span v-else>选择文件上传</span>
                </button>
                <span>{{fileName}}</span>
                <input type="file" ref="uploadFile" style="display:none" @change="upload"/>
            </template>
        </div>
        <div style="margin-top: 20px">
            <template>               
                <form>
                    <input type="file" @change="getFile($event)">
                    <button @click="submitForm($event)">提交</button>
                </form>
            </template>
        </div>
    </div>
</template>

<script>
    import mdContract from './contract.md.vue'
    import axios from 'axios'

    export default {
        name: 'page-one',
        components: {
            mdContract
        },
        data() {
            return {
                fileUrl: '',
                showPdf: false,
                contractVisable: false,
                uploadFileUrl: '',
                file: '',
                isShow: false,
                isShowTxt: '',
                Accept: "pdf,png,jpg,jpeg,doc,docx",
                Format: ["pdf","png","jpg","jpeg","doc","docx"],
                FileMaxSize: 1024 * 20,
                fileName: '',
            }
        },
        methods: {
            check() {
                window.open('/static/pdf/web/viewer.html')
            },
            checkLocal() {
                let url = 'demo.pdf'
                window.open('/static/pdf/web/viewer.html?file=' + url)
            },
            checkPpt() {
                window.open('http://view.officeapps.live.com/op/view.aspx?src=http%3a%2f%2fvideo.ch9.ms%2fbuild%2f2011%2fslides%2fTOOL-532T_Sutter.pptx')
            },
            checkWord() {
                //let url = 'http://192.168.1.168/group1/M00/00/00/wKgDgF80ovuAOfnXAAAtTWKoRoM24.docx'
                window.open('http://view.officeapps.live.com/op/view.aspx?src=http%3a%2f%2fapi.idocv.com%2fdata%2fdoc%2fmanual.docx')
            },
            checkError() {
                let url = 'http://somedomain/doc/manuals/R-intro.pdf' // 报错跨域
                window.open('/static/pdf/web/viewer.html?file=' + url)
            },
            checkNormal() {
                let url = 'http://192.168.1.168/group1/M00/00/00/wKgDgF8x8GCAGvitAA2Rlc-L9X0908.pdf'  // 有效 服务器配置跨域处理
                window.open('/static/pdf/web/viewer.html?file=' + url)
            },
            checkSuccess() {
                // 后台返回流的形式
                let url = 'http://192.168.1.168/group1/M00/00/00/wKgDgF8x8GCAGvitAA2Rlc-L9X0908.pdf'
                
                window.open('/static/pdf/web/viewer.html?file=' + encodeURIComponent(url))
            },
            //下载
            downFile() {
                let blob = new Blob([], { type: '' });
                let downloadElement = document.createElement('a');
                downloadElement.style.display = 'none';
                let href = window.URL.createObjectURL(blob);
                downloadElement.href = 'http://192.168.1.168:8082/upload/download?path=group1/M00/00/00/wKgDgF8yGRGAZtz3AAAmAHdKEmE237.jpg';
                console.log(downloadElement.href);
                document.body.appendChild(downloadElement);
                downloadElement.click();//点击下载
            },
            downFile1() {
                let blob = new Blob([], { type: '' });
                let downloadElement = document.createElement('a');
                downloadElement.style.display = 'none';
                let href = window.URL.createObjectURL(blob);
                downloadElement.href = 'http://192.168.1.168/group1/M00/00/00/wKgDgF80ovuAOfnXAAAtTWKoRoM24.docx';
                console.log(downloadElement.href);
                document.body.appendChild(downloadElement);
                downloadElement.click();//点击下载
            },
            // 这是打开本地文件进行预览
            preview(event) {
                let files = document.getElementById('myfile').files[0]
                if (files.type !== 'application/pdf') {
                    alert('只能上传一份pdf文件')
                    return
                }
                this.showPdf = true
                this.fileUrl = this.getObjectURL(files)

            },
            getObjectURL(file) {
                let url = null;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                }
                return url;
            },
            checkContract() {
                this.contractVisable = !this.contractVisable
            },
            close () {
                this.contractVisable = false
            },
            //上传
            uploadFile() {
                
            },
            //文件上传
            upload(event){
	            let files = event.target.files || event.dataTransfer.files;
                if (!files.length) {
                    this.fileName = '';
                    return;
                }
                this.fileName = files[0].name;
                // 上传之后调用接口...
                let formData = new FormData();
                // let config = { 
                //     headers:{ 'Content-Type': 'multipart/form-data' }
                // };
                console.log(this.fileName);
                formData.append('file',files[0]);
                console.log(files[0]);
                console.log(formData);
                this.$refs.uploadFile.value = null;
                var url = '/upload/upload';
                var config = {
                    method: 'POST',
                    url: url,
                    //withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    data: formData
                }
                // this.$http.post(url,formData,config).then((response) => {
                //     console.log(response);
                //     console.log('上传成功!');
                // }).catch((error) => {
                //     console.log(error);
                //     console.log('上传失败!');
                // })
                axios(config).then(response=>{
                    console.log(JSON.stringify(response.data));
                }).catch(error=>{
                    console.log(error);
                })
                
                this.$refs.uploadFile.value = null; 
            },
            click () {
                this.$refs.uploadFile.click();
            },
            getFile(event) {
                this.file = event.target.files[0];
                console.log(this.file);
            },
            submitForm(event) {
                event.preventDefault();
                let formData = new FormData();
                formData.append('file', this.file);   
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }   
                this.$http.post('http://192.168.1.8:10010/api/upload/upload', formData, config).then(function (response) {
                    if (response.status === 200) {
                        console.log(response.data);
                    }
                })
            }
        },
        mounted() {
            //this.uploadList = this.$refs.upload.fileList;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-one button {
    margin-left: 10px;
}
.oUpload{
    min-height: 1.5em;
    display: inline-block;
    padding: 12px 36px;
    margin: 5px 5px 5px 0px;
    cursor: pointer;
    opacity: 0.9;
    color: #FFF;
    font-size: 1em;
    letter-spacing: 1px;
    text-shadow: rgba(0,0,0,0.9) 0px 1px 2px;
    background: #00a679;
    border: 1px solid #99e9d4;
    border-radius: 4px;
    box-shadow: rgba(255,255,255,0.25) 0px 1px 0px, inset rgba(255,255,255,0.25) 0px 1px 0px, inset rgba(0,0,0,0.25) 0px 0px 0px, inset rgba(255,255,255,0.03) 0px 20px 0px, inset rgba(0,0,0,0.15) 0px -20px 20px, inset rgba(255,255,255,0.05) 0px 20px 20px;
    transition: all 0.1s linear;
}
.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}

.ivu-icon {
    line-height: 58px;
}
.uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.uploader-example .uploader-btn {
    margin-right: 4px;
}
.uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
