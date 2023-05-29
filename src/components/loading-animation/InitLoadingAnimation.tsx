import React from 'react';
import Lottie from "react-lottie";
import animation from '../../../public/loading_animation.json'

const InitLoadingAnimation = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return <Lottie options={defaultOptions} height={400} width={400}/>;
};

export default InitLoadingAnimation;