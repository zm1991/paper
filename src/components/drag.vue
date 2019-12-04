<template>
    <div>
        <ul
        @dragstart="onDragStart"
        @dragover="onDragOver"
        @dragend="onDragEnd"
        ref="parentNode">
            <slot></slot>
        </ul>
    </div>
</template>

<script>
export default{
    props:{
        targetEle: String
    },
    data(){
        return {
            data:[1,2,3,4,5,6],
            draging:null,//被拖拽的对象
            target:null,//目标对象
        }
    },
    mounted () {
        //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        }

    },
    methods:{
        onDragStart(event){
            if(this.targetEle){
                this.draging = event.target.parentNode;
            }else{
                this.draging = event.target;
            }
            this.startIndex = this._index(this.draging);
            this.draging.classList.add('actived')
        },
        onDragOver(event){
            if(this.targetEle){
                this.target = event.target.parentNode;
            }else{
                this.target = event.target;
            }
            let targetTop=this.target.getBoundingClientRect().top;
            let dragingTop=this.draging.getBoundingClientRect().top;
            if (this.target.nodeName === "LI"&&this.target !== this.draging) {
                if (this.target) {
                    if (this.target.animated) {
                        return;
                    }
                }
                if(this._index(this.draging)<this._index(this.target)){
                    this.target.parentNode.insertBefore(this.draging, this.target.nextSibling);
                }else{
                    this.target.parentNode.insertBefore(this.draging, this.target);
                }
                this._anim(targetTop,this.target);
                this._anim(dragingTop,this.draging);
            }
        },
        _anim(startPos,dom){
            let offset = startPos-dom.getBoundingClientRect().top;
            dom.style.transition = "none";
            dom.style.transform = `translateY(${offset}px)`;

            //触发重绘
            dom.offsetWidth; clearTimeout(dom.animated);

            dom.animated=setTimeout(()=>{
                dom.style.transition="";
                dom.style.transform=``;
                dom.animated=false;
            },300)
        },
        onDragEnd(){
            this.endIndex = this._index(this.draging);
            this.$emit('changeData', this.startIndex, this.endIndex);
            this.draging.classList.remove('actived');
        },
        _index(el){
            let domData=Array.from(this.$refs.parentNode.childNodes);
            return domData.findIndex(i=>i.innerText==el.innerText);
        }
    }
}
</script>

<style scoped>
    ul{
        list-style:none;
        padding-inline-start:0;
    }
    ul> li{
        display: block;
        min-height:24px;
        line-height:24px;
        border:1px solid #d9d9d9;   
        border-radius:4px;
        padding:10px;
        margin-bottom: 2px;
        background: white;
    }
    .targetIcon{
        cursor:move;
    }
    .actived{
        cursor: pointer;
        background-color:#9c9c9c;
    }
</style>