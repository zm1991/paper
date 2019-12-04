<template>
    <div class="paper">
        <div class="left">
            <h1>
                <template v-if="isEditTitle">
                    <a-input  style="width: 70%"/>
                </template>
                <template v-else>
                    
                </template>
                <a-icon type="edit" @click="editTitle" @blur="isEditTitle=false"/>
            </h1>
            <div v-for="(i, index) in examData" :key="index">
                <h5>{{index | toCh}}、{{i.type}}(共{{i.exam.length}}题；总分{{getSum(i.exam)}})</h5>
                <div v-for="(d, dIndex) in i.exam" :key="dIndex" class="exam">
                    <div v-if="selData === d" class="operate">
                        <a-button-group>
                            <a-input v-model.number="d.score"  placeholder="分数"  style="width: 100px" addonAfter="分"/>
                            <a-button @click="showDrawer(index, dIndex)">换题</a-button>
                            <a-button @click="swap(index, dIndex, -1)" :disabled="dIndex==0">上移</a-button>
                            <a-button @click="swap(index, dIndex, 1)" :disabled="dIndex==i.exam.length - 1">下移</a-button>
                            <a-button @click="removeExam(index, dIndex, 1)">删除</a-button>
                        </a-button-group>
                    </div>
                    <item :data="d" :dIndex="dIndex" @click="onSelect" :class="{isSelected:selData == d}" :isShow = 'isShowSel'></item>
                </div>
            </div>
        </div>
        <div class="right">
            <p>
                <span>总分<b>{{total}}</b></span>
                <span>题数<b>{{count}}</b>
                </span>
            </p>
            <drag targetEle="targetIcon"  @changeData = 'changeData' :key="dragKey">
                <li v-for="(i,index) in examData" :key="index" class="item" >
                    <a-icon type="drag" class="targetIcon opt" draggable="true" />
                    <a-icon type="delete" class="opt" @click="removeType(index)"/>
                    <h5>{{index | toCh}}、
                        <template v-if="editIndex===index">
                            <a-input v-model = 'i.type' style="width: 70%"/>
                        </template>
                        <template v-else>
                            {{i.type}} 
                        </template>
                        
                        <a-icon type="edit" @click="editSubTitle(index)" @blur="editIndex=''"/> 
                    </h5>
                    <p>题数：{{i.exam.length}}题</p>
                    <p>每题分数:<a-input v-model="scoreArrCopy[index]"  @blur="onBlurscore($event.target.value ,index)" placeholder="分数"  style="width: 50px"/>分</p>
                </li>
            </drag>
        </div>
        <!-- 替换选题抽屉 -->
        <div>
            <a-drawer :placement="placement" :closable="false" @close="onClose" :visible="visible" width = '800px'>
                <template v-slot:title>
                    <h6><a-button @click="getNewExamData">换一批</a-button><a-button @click="onClose">关闭</a-button></h6>
                </template>
                <div v-for = '(d, index) in newExamData.exam' :key='index' >
                    <item :data="d" :dIndex="index" :isShow = 'isShowSel'>
                        <template v-slot:changeBtn>
                            <a-button  @click="replaceData(index)" type="primary">替换</a-button>
                        </template>
                    </item>
                </div>
            </a-drawer>
        </div>
    </div>
</template>

<script>
// 页面数据流已完成，看了接口文档，服务这块对接感觉会有问题，如果需要调取服务，则在改数据的地方调取就可以
import drag from "./drag";
import item from "./item";
import TestData from './data.json';

export default {
    name: "HelloWorld",
    data() {
        return {
            examData: [], // 试题列表
            newExamData: [], // 替换的试题列表
            selData: "", // 选中的数据
            visible: false, // 替换试题 抽屉显示
            placement: 'right', // 抽屉显示方向
            dragKey: 0, // 用来完成拖动后重新刷新数据
            isShowSel:{
                detail : true,
                info : true
            }, // 是否显示详情
            isShow:{
                detail : true,
                info : true
            }, // 是否显示详情
            scoreArrCopy:[], // 大题设置分数
            editIndex:'', // 修改答题标题的索引
            isEditTitle: false // 试题标题编辑
        };
    },
    computed:{
        // 计算总分
        total(){
            let total = 0;
            this.examData.forEach((i) => {
                total += this.getSum(i.exam);
            })
            return total
        },
        // 计算题数
        count(){
            let count = 0;
            this.examData.forEach((i) => {
                count += i.exam.length;
            })
            return count
        },
        // 获取每个答题的数目是否一致
        scoreArr(){
            let da = this.examData.map((i) => {
                return i.exam.every((a)=>{ return a.score===i.exam[0].score}) ? i.exam[0].score: ''
            });
            this.copy();
            return da;
        }
    },
    filters: {
        // 转化为中文
        toCh(val) {
            let valArr = (val + 1).toString().split("");
            let arr = " 一二三四五六七八九".split("");
            let res = valArr.map(i => {
                return arr[i];
            });
            if (res.length > 1 && res[0] == "一") {
                res[0] = "";
            }
            return res.join("十");
        }
    },
    components: {
        item,
        drag
    },
    mounted() {
        // 获取数据
        this.setNewsApi();
    },
    methods: {
        // 选中数据，为了显示题目操作
        onSelect(d) {
            this.selData = d;
        },
        // 上移下移交换操作
        swap(typeIndex, dIndex, direction) {
            const data = Object.assign({}, this.examData[typeIndex].exam[dIndex]);
            this.$set(
                this.examData[typeIndex].exam,
                dIndex,
                this.examData[typeIndex].exam[dIndex + direction]
            );
            this.$set(this.examData[typeIndex].exam, dIndex + direction, data);
            this.selData = this.examData[typeIndex].exam[dIndex + direction];
        },
        // 删除试题
        removeExam(typeIndex, dIndex, direction) {
            this.examData[typeIndex].exam.splice(dIndex, direction);
        },
        // 迭代计算总数
        getSum(arr) {
            var sum = arr.reduce((prev, cur) => {
                return prev + cur.score;
            }, 0);
            return sum;
        },      
        // 拖拽之后改变数据，并重新渲染
        changeData: function(start, end){ 
            var data = this.examData.splice(start, 1);
            this.examData.splice(end, 0, ...data);
            this.dragKey++;
        },
        // 关闭抽屉
        onClose() {
            this.visible = false;
        }, 
        // 显示抽屉
        showDrawer(index, dIndex) {
            this.visible = true;
            this.replaceIdnex = {index, dIndex};
            this.getNewExamData();
        },
        // 根据ID获取数据
        setNewsApi: function() {
            this.examData = TestData;
        },
        // 根据ID获取相似数据
        getNewExamData : function() {
            this.newExamData = TestData[0];
        },
        // 替换试题数据
        replaceData : function(index){
            const da = this.newExamData.exam[index];
            this.$set(this.examData[this.replaceIdnex.index].exam, this.replaceIdnex.dIndex, da);
            this.onClose();
        },
        // 试题分数失去焦点之后更新试题数据
        onBlurscore(val, index){
            this.examData[index].exam.forEach((i) => {
                i.score = Number(val);
            });
        },
        // 复制计算出的每题分数给input使用
        copy(){
            this.scoreArrCopy = [...this.scoreArr];
        },
        // 删除大题项目
        removeType(index){
            this.examData.splice(index, 1);
        },
        // 大题题目可编辑
        editSubTitle(index){
            this.editIndex = index
        },
        // 试题题目可编辑
        editTitle(){
            this.isEditTitle = true;
        }
    }
};
</script>

<style scoped>
.paper{
    position: relative;
    padding: 50px;
    text-align: left;
}
h1{
    text-align: center;
}
.left {
    margin-right: 350px;
    max-width: 700px;
}
.right {
    width: 350px;
    position: absolute;
    right: 0;
    top: 0;
}
.isSelected {
    border: 1px solid #675;
}
.exam {
    position: relative;
}
.left h5 {
    text-align: left;
    font-weight: 600;
    font-size: 16px;
}
.operate {
    position: absolute;
    right: 0;
    top: -32px;
}
h6{
    text-align: right;
}
.opt{
    float: right;
}
</style>
