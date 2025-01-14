/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2016-NOW(至今) 筱锋
 * Author: 筱锋(https://www.x-lf.com)
 *
 * 本文件包含 XiaoMain 的源代码，该项目的所有源代码均遵循MIT开源许可证协议。
 * --------------------------------------------------------------------------------
 * 许可证声明：
 *
 * 版权所有 (c) 2016-2024 筱锋。保留所有权利。
 *
 * 本软件是“按原样”提供的，没有任何形式的明示或暗示的保证，包括但不限于
 * 对适销性、特定用途的适用性和非侵权性的暗示保证。在任何情况下，
 * 作者或版权持有人均不承担因软件或软件的使用或其他交易而产生的、
 * 由此引起的或以任何方式与此软件有关的任何索赔、损害或其他责任。
 *
 * 使用本软件即表示您了解此声明并同意其条款。
 *
 * 有关MIT许可证的更多信息，请查看项目根目录下的LICENSE文件或访问：
 * https://opensource.org/licenses/MIT
 * --------------------------------------------------------------------------------
 * 免责声明：
 *
 * 使用本软件的风险由用户自担。作者或版权持有人在法律允许的最大范围内，
 * 对因使用本软件内容而导致的任何直接或间接的损失不承担任何责任。
 * --------------------------------------------------------------------------------
 */

import {Route, Routes, useLocation, useNavigate} from "react-router";
import {HeaderComponent} from "../components/about/header_component.tsx";
import {animated, useSpring, useTransition} from "@react-spring/web";
import {AboutMe} from "./about/about_me.tsx";
import {AboutFriends} from "./about/about_friends.tsx";
import {AboutSponsor} from "./about/about_sponsor.tsx";
import {Button, Tooltip} from "@fluentui/react-components";
import {
    AppsAddInFilled,
    BookContactsRegular,
    CloudEditRegular,
    RecordStopRegular,
    StickerAddRegular
} from "@fluentui/react-icons";
import {useEffect, useState} from "react";

export function BaseAbout() {
    const location = useLocation();
    const navigate = useNavigate();

    const [openSideMenu, setOpenSideMenu] = useState<boolean>(false);
    const [openSideMenuDisplay, setOpenSideMenuDisplay] = useState<boolean>(false);
    const [timeOut, setTimeOut] = useState<number>(0);
    const [change, setChange] = useState<boolean>(false);

    const backgroundImageSpring = useSpring({
        from: {opacity: 0, transform: "scale(1.2)"},
        to: {opacity: 1, transform: "scale(1)"},
        config: {tension: 50, friction: 26},
    });

    // 路由切换的动画
    const transitions = useTransition(location, {
        from: {opacity: 0, transform: "translateY(20px)"},
        enter: {
            opacity: 1,
            transform: "translateY(0)",
            config: {tension: 100, friction: 26},
        }
    });

    const sideMenuSpring = useSpring({
        opacity: openSideMenu ? 1 : 0,
        transform: openSideMenu ? "translateY(0)" : "translateY(15px)",
        display: openSideMenuDisplay ? "block" : "none",
        config: {tension: 100, friction: 26}
    });

    useEffect(() => {
        if (change) {
            setOpenSideMenu(!openSideMenu);
            if (!openSideMenu) {
                setOpenSideMenuDisplay(true);
                clearTimeout(timeOut);
            } else {
                setTimeOut(setTimeout(() => {
                    setOpenSideMenuDisplay(false);
                }, 1000));
            }
            setChange(false);
        }
    }, [change, openSideMenu, openSideMenuDisplay, timeOut]);

    return (
        <>
            <animated.div style={backgroundImageSpring} className="w-full h-full fixed bottom-0 left-0">
                <img
                    src="https://i-cdn.akass.cn/2024/01/659d0941af288.jpg!wp"
                    alt=""
                    className="w-full h-full object-cover blur-lg opacity-40"
                    draggable={"false"}
                />
            </animated.div>
            <div className={"relative grid grid-cols-12"}>
                <div className={"col-span-12"}>
                    <HeaderComponent/>
                </div>
                <div className={"col-span-12 p-4 pb-20 md:p-10 md:flex md:justify-center"}>
                    <div className={"md:w-10/12 lg:w-8/12 xl:max-w-screen-xl"}>
                        {transitions((style, item) => (
                            <animated.div style={style}>
                                <Routes location={item}>
                                    <Route path={"/me"} element={<AboutMe/>}/>
                                    <Route path={"/friends"} element={<AboutFriends/>}/>
                                    <Route path={"/sponsor"} element={<AboutSponsor/>}/>
                                </Routes>
                            </animated.div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="hidden md:block">
                <div className="fixed bottom-0 right-0 grid gap-3 p-6">
                    <animated.div style={sideMenuSpring}>
                        <Tooltip content="联系博主" positioning={"before"} relationship="label" withArrow>
                            <Button size={"large"} appearance={"secondary"} icon={<BookContactsRegular/>}/>
                        </Tooltip>
                    </animated.div>
                    <animated.div style={sideMenuSpring}>
                        <Tooltip content="修改友链" positioning={"before"} relationship="label" withArrow>
                            <Button size={"large"} appearance={"secondary"} icon={<CloudEditRegular/>}/>
                        </Tooltip>
                    </animated.div>
                    <animated.div style={sideMenuSpring}>
                        <Tooltip content="友链申请" positioning={"before"} relationship="label" withArrow>
                            <Button onClick={() => navigate("/operate/add")} size={"large"} appearance={"secondary"} icon={<StickerAddRegular/>}/>
                        </Tooltip>
                    </animated.div>
                    <div className={"transition"}>
                        <Tooltip content="功能组件" positioning={"before"} relationship="label" withArrow>
                            <Button onClick={() => setChange((prop) => !prop)}
                                    size="large" appearance={"primary"}
                                    icon={openSideMenu ? <RecordStopRegular/> : <AppsAddInFilled/>}/>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </>
    );
}
