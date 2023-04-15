import React from "react";
import { ChromePicker } from "react-color";
import fsUP from "../assets/fontSizeUP.png";
import fsDOWN from "../assets/fontSizeDOWN.png";
import cPicker from "../assets/color-picker.png";
import cPickerClose from "../assets/color-picker-close.png";
import brightness_img from "../assets/brightness.png";
import skipTitle from "../assets/skipTitle.png";
import skipTitleOff from "../assets/skipTitleOff.png";
import keepRatioImg from "../assets/1-1-ratio.png";
import dontKeepRatioImg from "../assets/16-9-ratio.jpg";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

class FormatEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      cPickerOpen: false,
      color: "#FFFFFF",
      fontSize: 2,
      updating: false,
      brightness: 100
    };

    this.throttle = null;
  }

  componentDidUpdate(prevProps, prevState) {
    let { item, wordIndex, boxIndex } = this.props;

    if (
      wordIndex !== prevProps.wordIndex ||
      item._id !== prevProps.item._id ||
      boxIndex !== prevProps.boxIndex
    ) {
      let slides;
      if (item.type === "song")
        slides = item.arrangements[item.selectedArrangement].slides || null;
      else slides = item.slides || null;

      let slide = slides ? slides[wordIndex] : null;
      if (!slide) return;
      if (slide.boxes[0].brightness !== undefined)
        this.setState({ brightness: slide.boxes[0].brightness });
      else {
        this.setState({ brightness: 100 });
      }
      if (!slide.boxes[boxIndex] || !slide.boxes[boxIndex].fontSize) return;
      this.setState({ fontSize: slide.boxes[boxIndex].fontSize });
      let stringToRGB = slide.boxes[boxIndex].fontColor
        .replace(/[^\d,]/g, "")
        .split(",");
      this.setState({
        color: {
          r: stringToRGB[0],
          g: stringToRGB[1],
          b: stringToRGB[2],
          a: stringToRGB[3]
        }
      });
    }
  }

  openColors = () => {
    this.setState({ cPickerOpen: true });
  };

  closeColors = () => {
    this.setState({
      cPickerOpen: false
    });
  };

  changeBrightness = level => {
    this.setState({ brightness: level });
  };

  colorChange = event => {
    this.setState({ color: event.rgb });
    this.props.updateFontColor(event.rgb);
  };

  updateFont = fontSize => {
    if (fontSize > 10) {
      fontSize = 10;
    } else if (fontSize < 0.1) {
      fontSize = 0.1;
    }
    fontSize = Math.round(fontSize * 10) / 10;
    this.setState({ fontSize: fontSize, updating: false });
    this.props.updateFontSize(fontSize);
  };

  fontSizeUP = () => {
    let { fontSize } = this.state;
    this.updateFont(fontSize + 0.1);
  };

  fontSizeDOWN = () => {
    let { fontSize } = this.state;
    this.updateFont(fontSize - 0.1);
  };

  fontSizeChange = event => {
    let val;
    let { updating } = this.state;
    let that = this;
    if (event.target.value.length === 0) {
      this.setState({ fontSize: "" });
      return;
    }
    val = parseInt(event.target.value, 10);
    val /= 10;

    if (val > 10) val = 10;

    clearTimeout(this.throttle);
    if (updating) {
      this.throttle = setTimeout(function() {
        let fontSize = that.state.fontSize;
        that.updateFont(fontSize);
      }, 100);
    } else {
      this.setState({ updating: true });
      this.updateFont(val);
    }
  };

  updateSkipTitle = () => {
    if (this.props.item.skipTitle) this.props.updateSkipTitle(false);
    else this.props.updateSkipTitle(true);
  };

  updateKeepRatio = () => {
    const { item, wordIndex} = this.props;
    if (item && item.slides) {
      this.props.updateKeepRatio(!item.slides[wordIndex].boxes[0].keepRatio);
    }
    
  };

  updateNextOnFinish = () => {
    if (this.props.item.nextOnFinish) this.props.updateNextOnFinish(false);
    else this.props.updateNextOnFinish(true);
  };

  render() {
    let { cPickerOpen, fontSize, brightness } = this.state;
    let sliderStyle = { width: "5vw", margin: ".5vw 1vw" };
    let { item, wordIndex } = this.props;
    let showSkipTitle = false;
    if (item.type === "song")
      if (item.arrangements[item.selectedArrangement].slides.length > 1)
        showSkipTitle = true;

    return (
      <div>
        <div style={{ display: "flex" }}>
          <img
            className="imgButton"
            style={
              !cPickerOpen
                ? {
                    marginRight: "1vw",
                    fontSize: "calc(8px + 0.4vw)",
                    width: "1.5vw",
                    height: "1.5vw"
                  }
                : { display: "none" }
            }
            alt="cPicker"
            src={cPicker}
            onClick={this.openColors}
          />
          <img
            className="imgButton"
            style={
              !cPickerOpen
                ? { display: "none" }
                : {
                    marginRight: "1vw",
                    fontSize: "calc(8px + 0.4vw)",
                    width: "1.5vw",
                    height: "1.5vw"
                  }
            }
            alt="cPickerClose"
            src={cPickerClose}
            onClick={this.closeColors}
          />
          {cPickerOpen && (
            <div
              style={{
                position: "absolute",
                zIndex: 5,
                top: "5vh",
                backgroundColor: "#EEE",
                padding: "5px"
              }}
            >
              <ChromePicker
                color={this.state.color}
                onChange={this.colorChange}
              />
            </div>
          )}
          <input
            style={{
              width: "1.25vw",
              height: "1.25vw",
              textAlign: "center",
              marginRight: "1vw",
              fontSize: "calc(7px + 0.25vw)"
            }}
            value={String(fontSize * 10)}
            onChange={this.fontSizeChange}
          />
          <img
            className="imgButton"
            style={{ width: "1.25vw", height: "1.25vw", marginRight: "1vw" }}
            onClick={this.fontSizeUP}
            alt="fsUP"
            src={fsUP}
          />
          <img
            className="imgButton"
            style={{ width: "1.25vw", height: "1.25vw", marginRight: "1vw" }}
            onClick={this.fontSizeDOWN}
            alt="fsDOWN"
            src={fsDOWN}
          />
          <img
            style={{ marginTop: ".25vw", width: "1.5vw", height: "1.5vw" }}
            alt="brightness"
            src={brightness_img}
          />
          <Slider
            style={sliderStyle}
            min={1}
            value={brightness}
            onChange={this.changeBrightness}
            onAfterChange={() => this.props.updateBrightness(brightness)}
          />
        </div>
        <div style={{ display: "flex" }}>
          {showSkipTitle && (
            <div
              onClick={this.updateSkipTitle}
              className="imgButton"
              style={{
                fontSize: "calc(5px + 0.35vw)",
                height: "5vh",
                marginRight: "0.5vw"
              }}
            >
              {item.skipTitle && (
                <img
                  style={{
                    display: "block",
                    width: "1.25vw",
                    height: "1.25vw",
                    margin: "auto",
                    padding: "0.25vh 0.25vw"
                  }}
                  alt="skipTitle"
                  src={skipTitle}
                />
              )}
              {!item.skipTitle && (
                <img
                  style={{
                    display: "block",
                    width: "1.25vw",
                    height: "1.25vw",
                    margin: "auto",
                    padding: "0.25vh 0.25vw"
                  }}
                  alt="skipTitleOff"
                  src={skipTitleOff}
                />
              )}
              <div>Skip Title</div>
            </div>
          )}
          {item.type === "timer" && (
            <div
              onClick={this.updateNextOnFinish}
              className="imgButton"
              style={{
                fontSize: "calc(5px + 0.35vw)",
                height: "5vh",
                marginRight: "0.5vw"
              }}
            >
              {item.nextOnFinish && (
                <img
                  style={{
                    display: "block",
                    width: "1.25vw",
                    height: "1.25vw",
                    margin: "auto",
                    padding: "0.25vh 0.25vw"
                  }}
                  alt="skipTitle"
                  src={skipTitle}
                />
              )}
              {!item.nextOnFinish && (
                <img
                  style={{
                    display: "block",
                    width: "1.25vw",
                    height: "1.25vw",
                    margin: "auto",
                    padding: "0.25vh 0.25vw"
                  }}
                  alt="skipTitleOff"
                  src={skipTitleOff}
                />
              )}
              <div>Next On Finish</div>
            </div>
          )}
          {item && item.slides && item.slides[wordIndex] && item.slides[wordIndex].boxes && item.slides[wordIndex].boxes[0] &&
            <div
              onClick={this.updateKeepRatio}
              className="imgButton"
              style={{
                fontSize: "calc(5px + 0.35vw)",
                height: "5vh",
                marginRight: "0.5vw"
              }}
            >
              {item.slides[wordIndex].boxes[0].keepRatio && (
                <img
                  style={{
                    display: "block",
                    width: "1.25vw",
                    height: "1.25vw",
                    margin: "auto",
                    padding: "0.25vh 0.25vw"
                  }}
                  alt="keepRatioImg"
                  src={keepRatioImg}
                />
              )}
              {!item.slides[wordIndex].boxes[0].keepRatio && (
                <img
                  style={{
                    display: "block",
                    width: "1.25vw",
                    height: "1.25vw",
                    margin: "auto",
                    padding: "0.25vh 0.25vw"
                  }}
                  alt="dontKeepRatioImg"
                  src={dontKeepRatioImg}
                />
              )}
              <div>Change Ratio</div>
            </div>}
        </div>
      </div>
    );
  }
}
export default FormatEditor;
