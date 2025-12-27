import PropTypes from "prop-types";

const HeadingStyle = ({ level, tag: Tag, children, text }) => {
  // Define styles for each level
  const getHeadingStyles = (level) => {
    const styles = {
      "1": "xl:text-[36px] lg:text-[36px] md:text-[38px] sm:text-[38px] text-[28px] font-bold italic text-[#333333]",
      "2": "text-[22px] md:text-4xl font-normal text-black tracking-[4px] font-tenor  text-shadow-md leading-[40px]",
      "3": " text-[12px] md:text-[14px] font-normal text-[#555555] tracking-[1%] leading-[20px]",
      "4": "text-[13px] text-[#555555] font-normal leading-[20px]",
      "5": "group flex items-center text-[16px] text-gray-800 leading-[184%]",
      "6": "text-[12px] text-[#555555] leading-[158.5%]",
      "7": "text-[15px] text-[#DD8560] leading-[24px]",
      "8": "text-[16px] text-[#888888] leading-[20px]",//also use ase explore btn
      "9": "text-[16px] text-[#FCFCFC] leading-[26px] tracking-[1%]",
      "10": "text-[12px] text-black leading-[18px]",
      "11": "text-[12px] text-[#555555] leading-[18px]",
      "12": "text-[12px] text-black leading-[18px]",
      "13": "text-[12px] text-black leading-[18px]",
      "14": "text-[12px] text-[#333333] leading-[16px]",
      "15": `text-[16px] text-[${text}] leading-[24px]`,
      "16": `text-[16px] text-${text} leading-[24px]`,
      default: "text-lg", // Fallback style
    };

    return styles[level] || styles.default;
  };

  // Get class styles for the specified level
  const headingStyles = getHeadingStyles(level);

  return <Tag className={headingStyles}>{children}</Tag>;
};

// PropTypes validation
HeadingStyle.propTypes = {
  level: PropTypes.oneOf([
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15","16",
  ]).isRequired, // Style levels
  tag: PropTypes.string.isRequired, // HTML tag (h1, h2, p, etc.)
  children: PropTypes.node.isRequired, // Content inside the tag
};

export default HeadingStyle;
