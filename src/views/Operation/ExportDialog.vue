<template>
    <dialog-dom :title="title" :visible="visible" :show-footer="showFooter" :confirm-text="confirmText" :cancel-text="cancelText"
    @confirm="handleConfirm" @cancel="handleCancel" @close="handleClose">
    <template #content>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="25%" class="demo-ruleForm">
            <p class="styleTips">数据导出需要超管审核，审核通过后在导出记录下载使用</p>
            <el-form-item label="导出原因" prop="export_reason" >
              <el-input class="font-16" type="textarea" :autosize="{ minRows: 3, maxRows: 8}" v-model="ruleForm.export_reason" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="附件证明" prop="file_path" style="text-align: left">
              <uploadImg :itemData="uploadItem" :limit="1" @headCallBack="headCallBack"></uploadImg>
            </el-form-item>
            <div style="text-align:center;" class="m-t-30">
              <el-button class="btn_style_padding" size="medium"  @click="resetForm('ruleForm')">取消</el-button>
              <el-button class="btn_style_padding" type="primary" size="medium" @click="submitForm('ruleForm')">确定</el-button>
            </div>
        </el-form>
    </template>
  </dialog-dom>
</template>

<script setup>

</script>

<style scoped lang="scss"></style>
