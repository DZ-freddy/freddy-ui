<template>
    <div class="index">
        123
        <search-select-tree v-model="value" :option="treeData1"></search-select-tree>
    </div>
</template>

<script>
import SearchSelectTree from '@/components/SearchSelectTree'
export default {
    name: 'HelloWorld',
    components: {
        'search-select-tree': SearchSelectTree
    },
    data () {
        return {
            value:'1',
            treeData1: [
                {id:'1', label:'parent1'},
                {id:'2', label:'parent2'},
                {id:'3', label:'parent3'}
            ]
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
