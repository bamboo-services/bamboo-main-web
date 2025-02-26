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

import BackgroundWithIndex from "../assets/ts/body_background.ts";
import {Link} from "react-router";

import myAvatar from "../assets/images/my_avatar.png";
import {useSelector} from "react-redux";
import {SystemInfoEntity} from "../models/entity/system_info_entity.ts";
import {animated, useSpring, useSprings} from "@react-spring/web";
import {BambooSVG} from "../assets/svg/bamboo_svg.tsx";

export function BaseIndex() {
    const webInfoStore = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);
    const thisYear = new Date().getFullYear();

    const backgroundSpring = useSpring({
        from: {opacity: 0, transform: "scale(3)"},
        to: {opacity: 1, transform: "scale(1)"},
        config: {tension: 70, friction: 26},
    });

    const imageSpring = useSpring({
        from: {opacity: 0, transform: "translateX(-40px)"},
        to: {opacity: 1, transform: "translateX(0)"},
        delay: 200,
        config: {tension: 100, friction: 26},
    });

    const [springs] = useSprings(4, (index: number) => ({
        opacity: 1,
        transform: "translateX(0)",
        from: {opacity: 0, transform: "translateX(40px)"},
        delay: index * 500 + 200,
        config: {tension: 100, friction: 26},
    }));

    const footerLeftSpring = useSpring({
        from: {opacity: 0, transform: "translateX(-40px)"},
        opacity: 1,
        transform: "translateX(0)",
        delay: 2200,
        config: {tension: 100, friction: 26},
    });

    const footerRightSpring = useSpring({
        from: {opacity: 0, transform: "translateX(40px)"},
        opacity: 1,
        transform: "translateX(0)",
        delay: 2200,
        config: {tension: 100, friction: 26},
    });

    document.title = `${webInfoStore.site.site_name} - ${webInfoStore.blogger.nick}`;

    return (
        <div className={"overflow-hidden"}>
            <animated.div style={{...backgroundSpring, ...BackgroundWithIndex}} className={"h-dvh grid"}>
                <div className={"grid grid-cols-4 gap-8 justify-center items-center px-8 lg:px-32"}>
                    <animated.div style={imageSpring} className={"hidden lg:flex col-span-1 items-center"}>
                        <img alt="UserAvatar" className={"rounded-full size-auto object-cover lg:h-48 xl:h-64"}
                             src={myAvatar} draggable={false}/>
                    </animated.div>
                    <div className={"col-span-4 lg:col-span-3"}>
                        <div className={"text-center grid gap-3"}>
                            <animated.div style={springs[0]} className={"flex justify-center"}>
                                <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl flex gap-3"
                                    style={{textShadow: "1px 1px 4px rgba(38,164,192,0.32)"}}>
                                    <BambooSVG size={52}/>
                                    <span>{webInfoStore.site.site_name}</span>
                                </h1>
                            </animated.div>
                            <animated.div style={springs[1]} className={"lg:hidden items-center flex justify-center"}>
                                <img alt="UserAvatar" className={"rounded-xl w-auto h-32"}
                                     src={myAvatar} draggable={false}/>
                            </animated.div>
                            <animated.p style={springs[2]} className={"lg:text-xl/relaxed"}>
                                {webInfoStore.blogger.description}
                            </animated.p>
                            <animated.div style={springs[3]}
                                          className={"flex flex-wrap justify-center gap-4 pt-8 md:pt-6 lg:pt-4"}>
                                <Link
                                    className={"transition block rounded bg-blue-500 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring sm:w-auto shadow-xl shadow-blue-500/50"}
                                    to={"https://blog.x-lf.com"}
                                >
                                    去我的博客吧
                                </Link>
                                <Link to={"/about/me"}
                                      className={"transition block rounded bg-green-500 px-12 py-3 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring sm:w-auto shadow-xl shadow-green-500/55"}>
                                    了解我的更多
                                </Link>
                            </animated.div>
                        </div>
                    </div>
                </div>
                <footer
                    className={"hidden md:flex absolute inset-x-0 bottom-0 justify-between items-end p-3 text-gray-500"}>
                    <animated.div style={footerLeftSpring} className={"grid"}>
                        <Link to={'/admin/dashboard'}>账户登录</Link>
                        <span>Copyright (C) 2016-{thisYear} 筱锋xiao_lfeng. All Rights Reserved.</span>
                    </animated.div>
                    <animated.div style={footerRightSpring} className={"grid text-end"}>
                        <Link to={"https://beian.miit.gov.cn/#/Integrated/index"} target={"_blank"}>
                            粤ICP备 2022014822 号
                        </Link>
                        <Link to={"https://beian.mps.gov.cn/#/query/webSearch"} target={"_blank"}>
                            粤公网安备 44030702003207 号
                        </Link>
                    </animated.div>
                </footer>
                <footer className={"grid md:hidden text-gray-500 text-center pt-8 absolute inset-x-0 bottom-0 pb-3"}>
                    <Link to={'/auth/login'}>账户登录</Link>
                    <Link to={"https://beian.miit.gov.cn/#/Integrated/index"} target={"_blank"}>
                        粤ICP备 2022014822 号
                    </Link>
                </footer>
            </animated.div>
        </div>
    );
}
