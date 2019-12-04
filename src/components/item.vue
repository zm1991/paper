
<template>
    <div @click="onSelect" class="item">
        <div class="question">{{dIndex+1}}.({{data.score}}分) {{data.stem}}</div>
        <div class="options">
            <span v-for = "(i, index) in data.options" :key="index">{{i.num}}.{{i.content}}</span>
        </div>
        <div class="detail" v-if="isShow.detail">
            <p class="point">【考点】<span>{{data.examPoint}}</span></p>
            <p class="answer">【答案】<span>{{data.realAns}}</span></p>
            <p class="analysis">【解析】<span>{{data.analysis}}</span></p>
        </div>
        <div class="info" v-if="isShow.info">
            <span>
                题型：<span>{{data.questionTypeStr}}</span>
            </span>
            <span>
                难易度：<span>{{data.diffStr}}</span>
            </span>
            <span>
                年份：<span>{{data.year}}</span>
            </span>
            <span>
                来源：<span>{{data.founder}}</span>
            </span>
            <div class="btn">
                <slot name="changeBtn"></slot>
            </div>
        </div>
    </div>
</template> 

<script>
// 包括题型-questionType、
// 题型描述-questionTypeStr、
// 题干-stem、
// 难易度-difficulty、
// 难易度描述-diffStr、
// 来源-founder、
// 年份-year、
// 分值-score、
// 考点-examPoint、
// 操作描述和选项list集合-options(选项/操作序号-num,选项内容/操作详情-content，是否判分点-judgementPoint)、
// 答案-realAns、
// 试题解析-analysis、
// 素材列表-materialList（文件路径-path,原文件-isResult,结果文件-isRoot）等
export default {
    props:{
        data : Object,
        dIndex : Number,
        isShow : {
            default: () => {
                return {}
            }
        }
    },
    methods:{
        onSelect() {
            this.$emit('click', this.data);
        }
    }
}
</script>

<style scoped>

    .item{
        border-bottom: 1px dashed #e8e8e8;
        padding: 10px;
        margin-bottom: 10px;
    }
    .info{
        position: relative;
    }
    .info > span{
        margin-right: 2em;
    }
    .question{
        margin-bottom: 10px;
    }
    .options{
        display: flex;
        justify-content:space-between;
    }
    .btn {
        position: absolute;
        right: 10px;
        bottom: 0;
    }
</style>