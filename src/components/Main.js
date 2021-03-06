require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/image-datas.js');

// let ImgFigure = require('./img-figure.js') //commonjs方式引入
import ImgFigure from './img-figure.js';

// let ControllerUnit = require('./controller-unit.js')
import ControllerUnit from './controller-unit.js'

function genImageURL(imageDatasArr) {
  for (var i = 0; i < imageDatasArr.length; i++) {
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName)

    imageDatasArr[i] = singleImageData
  }
  return imageDatasArr
}

imageDatas = genImageURL(imageDatas)

/**
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

/**
 * 获取 -30deg~30deg 之间的一个随机值
 */
function get30DegRandom() {
  return getRangeRandom(-30, 30)
}

/**
 * 下面的 ImgFigure 组件用模块化封装了
 */
// class ImgFigure extends React.Component {
//
//   constructor(props){
//     super(props);
//     this.handleClick = this.handleClick.bind(this)
//     // console.log(this);
// }
//
//   /**
//    * ImgFigure 的点击处理函数
//    * @return {[type]} [description]
//    */
//   handleClick(e) {
//     e.stopPropagation();
//     e.preventDefault();
//     this.props.inverse()
//     console.log(this);
//   }
//
//
//
//   render() {
//
//     let styleObj = {}
//
//     //如果props属性中指定了这张图片的位置，则使用
//     if (this.props.arrange.pos) {
//       styleObj = this.props.arrange.pos
//     }
//
//     //如果图片的旋转角度有值并且不为0，添加旋转角度
//     if (this.props.arrange.rotate) {
//       ['Webkit', 'Moz', 'Ms'].forEach((item)=>{
//         styleObj[`${item}Transform`] = `rotate(${this.props.arrange.rotate}deg)`
//       })
//     }
//
//     let imgFigureClassName = 'img-figure';
//     if (this.props.arrange.isInverse) {
//       imgFigureClassName += ' is-inverse'
//     }
//
//     // console.log('this',this);
//
//     return (
//       <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
//         <img src={this.props.data.imageURL} alt={this.props.data.title}/>
//         <figcaption>
//           <h2 className="img-title">{this.props.data.title}</h2>
//           <div className="img-back" onClick={this.handleClick}>
//             <p>
//               {this.props.data.desc}
//             </p>
//           </div>
//         </figcaption>
//       </figure>
//     );
//   }
// }

/**
 * 以下写法已经随react版本升级而不适用了，虽然能运行，但会有warning
 */
// let ImgFigure = React.createClass({
//   render() {
//     return (
//       <figure className="img-figure">
//         <img src={this.props.data.imageURL} alt={this.props.data.title}/>
//         <figcaption>
//           <h2 className="img-title">{this.props.data.title}</h2>
//         </figcaption>
//       </figure>
//     );
//   }
// })

class AppComponent extends React.Component {

  // let AppComponent = React.createClass({

  /**
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的
   * 图片信息数组的index值
   * @return {function} 这是一个闭包函数，其内return一个
   * 真正待被执行的函数
   */
  inverse(index) {
    return () => {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({imgsArrangeArr})
    }
  }

  /**
   * 重新布局所有图片
   * @param  {[number]} centerIndex [居中图片的 index]
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr
    let constant = this.state.constant;

    let centerPos = constant.centerPos
    let hPosRange = constant.hPosRange
    let vPosRange = constant.vPosRange
    let hPosRangeLeftSecX = hPosRange.leftSecX
    let hPosRangeRightSecX = hPosRange.rightSecX
    let hPosRangeY = hPosRange.y

    let vPosRangeX = vPosRange.x
    let vPosRangeTopY = vPosRange.topY

    let imgsArrangeTopArr = []
    let topImgNum = Math.round(Math.random()) //取 0 或 1 个

    let topImgSpliceIndex = 0 //上部区域图片的序号
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1) //中心图片

    //首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos

    //居中的 centerIndex 图片不需要旋转
    imgsArrangeCenterArr[0].rotate = 0

    //居中的图片的isCenter属性设置为true
    imgsArrangeCenterArr[0].isCenter = true

    // 取出要布局上部区域的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum))
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum)

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((item, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      }
    })

    // 布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局在左边，右半部分布局在右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom()
      }
    }

    //还原原图片数组
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0])

    this.setState({imgsArrangeArr})
  }

  /**
   * 利用 rearrange 函数，居中对应 index 的图片
   * @param  {[Number]} 需要被居中的图片的 index 的值
   * @return {[Function]}  闭包函数
   */
  center(index) {
    return () => {
      this.rearrange(index)
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [/*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0, //旋转角度
          isInverse: false, //图片正反面，false为正面，true为反面
          isCenter: false
        } */
        ],

      //constant存储排布的可取值范围
      constant: {
        centerPos: { //中心图片的位置
          left: 0,
          top: 0
        },
        hPosRange: { //水平方向的取值范围
          leftSecX: [
            0, 0
          ],
          rightSecX: [
            0, 0
          ],
          y: [0, 0]
        },
        vPosRange: { //垂直方向的取值范围
          x: [
            0, 0
          ],
          topY: [0, 0]
        }
      }
    }
  }

  // getInitialState() {
  //   return {
  //     imgsArrangeArr: [
  //       /*{
  //         pos: {
  //           left: '0',
  //           top: '0'
  //         }
  //       } */
  //     ]
  //   }
  // }

  // 组件加载后，为每张图片计算其位置的范围
  componentDidMount() {

    // 首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    let stageW = stageDOM.scrollWidth;
    let stageH = stageDOM.scrollHeight;
    let halfStageW = Math.floor(stageW / 2);
    let halfStageH = Math.floor(stageH / 2);

    //拿到一个 imgFigure 的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDOM.scrollWidth;
    let imgH = imgFigureDOM.scrollHeight;
    let halfImgW = Math.floor(imgW / 2);
    let halfImgH = Math.floor(imgH / 2);

    //计算中心图片的位置点
    this.state.constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧、右侧区域图片排布位置的取值范围
    this.state.constant.hPosRange.leftSecX[0] = -halfImgW;
    this.state.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.state.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.state.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.state.constant.hPosRange.y[0] = -halfImgH;
    this.state.constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.state.constant.vPosRange.topY[0] = -halfImgH;
    this.state.constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.state.constant.vPosRange.x[0] = halfStageW - imgW;
    this.state.constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {

    let controllerUnits = [];
    let ImgFigures = [];
    imageDatas.forEach((item, index) => {

      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      ImgFigures.push(
        <ImgFigure data={item} key={`ImgFigure${index}`} ref={`imgFigure${index}`} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}></ImgFigure>
      )
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}></ControllerUnit>)
        })

        // console.log(ImgFigures);

        return (
        <section className="stage" ref="stage">
          <section className="img-sec">
            {ImgFigures}
          </section>

          <nav className="controller-nav">
            {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
