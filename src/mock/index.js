import Mock from 'mockjs'
import { produceNewsData } from './helloWorld/index'
Mock.mock(/\/news\/index/, 'post', produceNewsData);