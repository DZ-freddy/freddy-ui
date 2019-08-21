<template>
    <div class="search-select-tree">
        <el-popover
                placement="bottom"
                :width="selectWidth"
                trigger="click"
                :disabled="disabled">
            <div class="search-select-tree-content" >
                <el-input v-model="keyWord" >
                    <el-button icon="el-icon-search" slot="append" @click="handleSearch"></el-button>
                </el-input>
                <div style="top:44px; height:calc(100% - 42px);" class="option-container">
                    <el-tree ref="tree"
                             :data="option"
                             :default-expanded-keys="expendKey"
                             show-checkbox
                             node-key="id"
                             :props="props"
                             @check="handleCheckChange"
                             @node-click="handleNodeClick"
                             :expand-on-click-node="false"
                             check-strictly
                             :filter-node-method="filterNode">
                    </el-tree>
                </div>
            </div>
            <div slot="reference" tabindex="1" >
                <el-input readonly :value="label" ref="searchSelectInput"
                          @focus="getPopoverWidth"
                          @click.native="inputClick"
                          suffix-icon="el-icon-arrow-down">
                    <i v-if="clearable" class="el-icon-error" style="cursor:pointer;" slot="suffix" @click.stop="clearInput"></i>
                </el-input>
            </div>
        </el-popover>
        <!--<search-select-tree-->
                <!--v-model="item.value"-->
                <!--:option="data"-->
                <!--:props="{value:'id',label:'name',children:'children'}"-->
                <!--:disabled-parent="true" 是否禁选有下级的-->
                <!--:multiple="true" 是否多选-->
                <!--:autoClose="false" 是否自动关闭弹窗-->
                <!--:expanded="true"> 是否默认展开数据的第一个
                    :clearable="true"-->
        <!--</search-select-tree> 使用案例-->
    </div>
</template>

<script>
    import {Popover,Tree,Input} from 'element-ui';
    export default {
        components: {
            'el-popover':Popover,
            'el-tree':Tree,
            'el-input':Input
        },
        props: {
            option: {
                type: Array,
                required:true,
                default() {
                    return [];
                }
            },
            value: {
                type: String,
                required: true,
                default:''
            },
            props:{
                type: Object,
                default(){
                    return {
                        value:'value',
                        label:'label',
                        children:'children'
                    }
                }
            },
            autoClose:{    //选择后是否自动关闭弹窗，多选不会自动关闭弹窗
                type: Boolean,
                default:true
            },
            expanded:{
                type: Boolean,
                default:true
            },
            placeholder:{
                type: String,
                default:'请选择'
            },
            multiple:{
                type: Boolean,
                default:false
            },
            disabledParent:{
                type: Boolean,
                default:false
            },
            disabled:{
                type: Boolean,
                default:false
            },
            clearable:{
                type: Boolean,
                default:false
            }
        },
        data() {
            return {
                selectWidth:'244',
                keyWord:'',
                label:'',
                expendKey:[],
                checkedKey:''
            };
        },
        computed:{
            newValue: {
                get: function () {
                    return this.value;
                },
                set: function (value) {
                    this.$emit('input', value);
                }
            },
        },
        watch:{
            option(newOption){
                this.getExpendKey();
                this.setCheck(this.value);
                if(this.disabledParent){
                    this.setDisabled();
                }
            },
            value(){
                this.getExpendKey();
                this.setCheck(this.value);
                if(this.disabledParent){
                    this.setDisabled();
                }
            }
        },
        created(){
            this.getExpendKey();
        },
        mounted(){
            this.getPopoverWidth();
        },
        methods: {
            getExpendKey(){
                if(this.expanded&&this.option.length !== 0){
                    this.expendKey = [this.option[0][this.props.value]];
                }
            },
            setDisabled(){
                let option = this.option,
                    children = this.props['children'],
                    findHasChildren = function(option){
                        for(let item of option){
                            if(item[children]&&item[children].length>0){
                                item.disabled = true;
                                findHasChildren(item[children]);
                            }
                        }
                    };
                findHasChildren(option);
                this.$nextTick(()=>{
                    this.disabledAddTitle();
                });
            },
            getPopoverWidth(){
                this.selectWidth = this.$refs['searchSelectInput'].$el.offsetWidth;
            },
            inputClick(e){
                this.$emit('click',e);
            },
            handleClose(){
                document.body.click();
            },
            handleSearch(){
                this.$refs['tree'].filter(this.keyWord);
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            handleCheckChange(item,row){
                let props = this.props;
                if(this.multiple){
                    let nameArr = [];
                    this.newValue = row.checkedKeys.toString();
                    for(let item of row.checkedNodes){
                        nameArr.push(item[props.label]);
                    }
                    this.label = nameArr.toString();
                }else{
//                    if (row.checkedKeys.length > 0) {   //上面watch那边已经监听，移除该功能
//                        this.setCheck(item[props.value]);
//                    }
                    if(this.newValue === item[props.value]){
                        this.newValue = '';
                        this.label = '';
                    }else{
                        this.newValue = item[props.value];
                        this.label = item[props.label];
                    }
                }
                this.$emit('change',item);
                if(!this.multiple&&this.autoClose){
                    this.handleClose();
                }
            },
            handleNodeClick(item,row){
                if(row.disabled){ return false; }  
                let tree = this.$refs['tree'],
                    checkedNodes = tree.getCheckedNodes(),
                    props = this.props,
                    result = true,
                    checkNoSame = ()=>{
                        for(let index in checkedNodes){
                            if(checkedNodes[index].id === item.id){
                                result = index;
                                break;
                            }
                        }
                    };
                if(this.multiple){
                    checkNoSame();
                    if(result === true){   //没有相同的就填充
                        checkedNodes.push(item);
                        tree.setCheckedNodes(checkedNodes);
                    }else{   //有相同的就移除
                        checkedNodes.splice(result,1);
                        tree.setCheckedNodes(checkedNodes);
                    }
                    let idArr = [],
                        nameArr = [];
                    for(let item of checkedNodes){
                        idArr.push(item[props.value]);
                        nameArr.push(item[props.label]);
                    }
                    this.label = nameArr.toString();
                    this.newValue = idArr.toString();
                }else{
//                    if(checkedNodes.length > 0) { //上面watch那边已经监听，移除该功能
//                        this.setCheck(item.id);
//                    }
                    if(this.newValue === item[props.value]){
                        this.newValue = '';
                        this.label = '';
                    }else{
                        this.newValue = item[props.value];
                        this.label = item[props.label];
                    }
                }
                this.$emit('change',item);
                if(!this.multiple&&this.autoClose){
                    this.handleClose();
                }
            },
            setCheck(ids){
                let idArr = ids.split(',');
                this.expendKey = this.expendKey.concat(idArr);  //默认展开已经选中的所在项
                this.$refs['tree'].setCheckedKeys(idArr);
                this.$nextTick(()=>{
                    this.getCheckLabel();
                });
            },
            getCheckLabel(){
                let nodeArr = this.$refs['tree'].getCheckedNodes(),
                    nameArr = [];
                for(let item of nodeArr){
                    nameArr.push(item.name);
                }
                this.label = nameArr.toString();
            },
            disabledAddTitle(){
                let aDisabledArr = this.$refs['tree'].$el.querySelectorAll('.is-disabled');
                for(let i =0,len=aDisabledArr.length; i<len; i++){
                    //aDisabledArr[i].title = '不能选择有下级的属性';
                    aDisabledArr[i].style.display = 'none';
                }
            },
            clearInput(){
                this.label = '';
                this.newValue = '';
            }
        }
    };
</script>
<style lang="scss">
    .search-select-tree-content {
        position:relative;
        height:258px;
        .option-container {
            .el-tree {
                background:none;
            }
        }
        .content-bottom {
            position:absolute;
            bottom:0;
            right:0;
            text-align:right;
        }
    }

</style>
