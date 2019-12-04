// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;
// mock一组数据
export const produceNewsData = function() {
    let paper = [];
    for(let j = 0; j < 3; j++) {
        let exam= [];
        for (let i = 0; i < 5; i++) {
            let newArticleObject = {
                stem: Random.csentence(5, 30), //  Random.csentence( min, max )
                score:Random.integer(1, 10),
                examPoint:Random.csentence(5, 30),
                'questionType':Random.csentence(5, 30),
                'questionTypeStr':Random.csentence(5),
                'difficulty':Random.csentence(5, 30),
                'diffStr':Random.csentence(5),
                'founder':Random.csentence(5),
                'year':'2019',
                'options':[],
                realAns:Random.csentence(5, 30),
                analysis:Random.csentence(5, 30)
            }
            exam.push(newArticleObject)
        }
        paper.push({
            type: Random.csentence(5, 8),
            exam : exam
        })
    }
    
    
    return paper;
}