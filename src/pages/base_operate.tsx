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

import {Link, Route, Routes, useLocation} from "react-router";
import {OperateAddFriends} from "./operate/operate_add_friends.tsx";
import {animated, useSpring, useSprings, useTransition} from "@react-spring/web";
import {BookContactsRegular, CloudEditRegular, HomeRegular, StickerAddRegular} from "@fluentui/react-icons";
import noAvatar from "../assets/images/no_avatar.png";
import {useEffect, useState} from "react";
import {LinkDisplayModule} from "../models/modules/link_display_module.ts";
import {OperateEditFriends} from "./operate/operate_edit_friends.tsx";

export function BaseOperate() {
    const location = useLocation();

    const [linkDisplay, setLinkDisplay] = useState<LinkDisplayModule>({} as LinkDisplayModule);
    const [hasDisplay, setHasDisplay] = useState<boolean>(false);

    const backgroundImageSpring = useSpring({
        from: {opacity: 0, transform: "scale(1.2)"},
        to: {opacity: 1, transform: "scale(1)"},
        config: {tension: 50, friction: 26},
    });

    useEffect(() => {
        if (linkDisplay.site_name === undefined || linkDisplay.site_name === "") {
            setHasDisplay(false);
            return;
        }
        if (linkDisplay.site_logo === undefined || linkDisplay.site_logo === "") {
            setHasDisplay(false);
            return;
        }
        if (linkDisplay.site_description === undefined || linkDisplay.site_description === "") {
            setHasDisplay(false);
            return;
        }
        setHasDisplay(true);
    }, [linkDisplay]);

    useEffect(() => {
        if (!location.pathname.includes("add")) {
            setLinkDisplay({} as LinkDisplayModule);
        }
    }, [location.pathname]);

    const linkSeeSpring = useSpring({
        opacity: hasDisplay ? 1 : 0,
        transform: hasDisplay ? "translateY(0)" : "translateY(-25px)",
        display: hasDisplay ? "block" : "none",
        config: {tension: 170, friction: 26},
    });

    // 路由切换的动画
    const transitions = useTransition(location, {
        from: {opacity: 0, transform: "translateX(20px)"},
        enter: {
            opacity: 1,
            transform: "translateX(0)",
            config: {tension: 100, friction: 26},
        }
    });

    const insertMenuSpring = useSpring({
        to: {
            opacity: 1,
            transform: hasDisplay ? "translateY(12px) translateX(0px)" : "translateY(0px) translateX(0px)"
        },
        from: {opacity: 0, transform: "translateX(-20px)"},
        config: {tension: 100, friction: 15},
    });

    const indexSpring = useSpring({
        opacity: 1,
        transform: "translateX(0)",
        from: {opacity: 0, transform: "translateX(20px)"},
        delay: 150,
        config: {tension: 100, friction: 26},
    });

    const [menuSprings] = useSprings(4, (index: number) => ({
        opacity: 1,
        transform: "translateX(0)",
        from: {opacity: 0, transform: "translateX(-10px)"},
        delay: index * 150 + 300,
        config: {tension: 100, friction: 26},
    }));

    function currentRoute(path: string): string {
        return location.pathname.includes(path) ?
            "transition block p-2 rounded-md bg-primary text-gray-900 flex space-x-1"
            : "transition block p-2 rounded-md text-gray-800 hover:bg-base-300 flex space-x-1";
    }

    return (
        <>
            <animated.div style={backgroundImageSpring} className="fixed w-full h-full bottom-0 left-0 z-0">
                <img
                    src="https://i-cdn.akass.cn/2025/01/6784cb797e652.jpg!wp"
                    alt=""
                    className="w-full h-full object-cover blur-lg opacity-70"
                    draggable={"false"}
                />
            </animated.div>
            <div className={"relative grid grid-cols-12 p-16 justify-center lg:px-48 xl:px-64 2xl:px-72 gap-3 z-50"}>
                <div className={"col-span-3 hidden md:flex flex-col"}>
                    <animated.div style={linkSeeSpring}
                                  className={"card card-border bg-base-100 card-sm shadow-md"}>
                        <div className="card-body grid gap-1 text-center">
                            <div className={"flex justify-center"}>
                                <img src={linkDisplay?.site_logo}
                                     onError={(e) => {
                                         e.currentTarget.src = noAvatar;
                                         e.currentTarget.onerror = null;
                                     }}
                                     alt={""} draggable={false}
                                     className={"rounded-full size-12 lg:size-16 shadow-lg shadow-gray-100"}/>
                            </div>
                            <div className={"text-lg font-bold truncate"}>{linkDisplay?.site_name}</div>
                            <div className={"text-sm font-light text-gray-400 line-clamp-1"}>
                                {linkDisplay?.site_description}
                            </div>
                        </div>
                    </animated.div>
                    <animated.div style={insertMenuSpring}>
                        <div className={"card card-border bg-base-100 card-sm shadow-md"}>
                            <div className="card-body">
                                <animated.div style={menuSprings[0]}>
                                    <Link to={"/"}
                                          className={"transition p-2 rounded-md flex space-x-1 items-center text-gray-800 hover:bg-base-300"}>
                                        <HomeRegular fontSize={20}/>
                                        <span>首页</span>
                                    </Link>
                                </animated.div>
                                <animated.div style={menuSprings[1]}>
                                    <Link to={"/operate/add"}
                                          className={currentRoute("add")}>
                                        <StickerAddRegular fontSize={20}/>
                                        <span>友链申请</span>
                                    </Link>
                                </animated.div>
                                <animated.div style={menuSprings[2]}>
                                    <Link to={"/operate/edit"}
                                          className={currentRoute("edit")}>
                                        <CloudEditRegular fontSize={20}/>
                                        <span>修改友链</span>
                                    </Link>
                                </animated.div>
                                <animated.div style={menuSprings[3]}>
                                    <Link to={"/operate/contact"}
                                          className={currentRoute("contact")}>
                                        <BookContactsRegular fontSize={20}/>
                                        <span>与我联系</span>
                                    </Link>
                                </animated.div>
                            </div>
                        </div>
                    </animated.div>
                </div>
                <animated.div style={indexSpring} className={"col-span-full md:col-span-9"}>
                    <div className="grid gap-1 card card-border bg-base-100 card-sm shadow-md w-full">
                        <div className={"card-body"}>
                            {transitions((style, item) => (
                                <animated.div style={style} className={"w-full"}>
                                    <Routes location={item}>
                                        <Route path={"/add"}
                                               element={<OperateAddFriends emitLinkDisplay={setLinkDisplay}/>}/>
                                        <Route path={"/edit"}
                                               element={<OperateEditFriends emitLinkDisplay={setLinkDisplay}/>}/>
                                    </Routes>
                                </animated.div>
                            ))}
                        </div>
                    </div>
                </animated.div>
            </div>
        </>
    );
}
