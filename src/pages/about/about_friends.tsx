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

import {GetLinkAPI} from "../../apis/api_link.ts";
import {JSX, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {Link} from "react-router";
import {Util} from "../../assets/ts/utils/process_util.ts";
import {LinkFilled} from "@fluentui/react-icons";
import {LinkGetEntity} from "../../models/entity/link_get_entity.ts";
import {setToaster} from "../../stores/toaster_store.ts";
import {ToastStore} from "../../models/store/toast_stores.ts";
import {animated, useSprings} from "@react-spring/web";

import noAvatar from "../../assets/images/no_avatar.png";

export function AboutFriends() {
    const webInfo = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);
    const dispatch = useDispatch();

    const [getLink, setGetLink] = useState({} as LinkGetEntity);
    const [webReveal, setWebReveal] = useState([] as JSX.Element[]);

    const [springs] = useSprings(webReveal.length, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(40px)"},
        delay: index * 500 + 200,  // 根据元素的索引控制延迟
        config: {tension: 100, friction: 26},
    }));

    useEffect(() => {
        setTimeout(async () => {
            const getRes = await GetLinkAPI();
            if (getRes?.output === "Success") {
                setGetLink(getRes.data!);
            } else {
                dispatch(setToaster({
                    title: getRes?.message,
                    message: getRes?.error_message,
                    type: "error"
                } as ToastStore));
            }
        }, 1);
    }, [dispatch]);

    useEffect(() => {
        try {
            // 对数据进行循环获取操作
            const locationWeb: JSX.Element[] = [];
            for (const locationElement of getLink.locations) {
                const locationLinks: JSX.Element[] = [];
                // 对内链接数据进行循环遍历
                for (const linkElement of locationElement.links) {
                    locationLinks.push(
                        <Link to={linkElement.site_url} target={"_blank"} key={linkElement.id}
                              className={"transition duration-300 rounded-lg bg-white shadow-md shadow-white hover:scale-105 grid gap-1 text-center justify-center p-3"}>
                            <div className={"flex justify-center"}>
                                <img src={Util.TwoUrlSelectNoEmpty(linkElement.site_logo, linkElement.cdn_logo_url)}
                                     onError={(e) => {
                                         e.currentTarget.src = noAvatar;
                                         e.currentTarget.onerror = null;
                                     }}
                                     alt={""} draggable={false}
                                     className={"rounded-full size-12 lg:size-16 shadow-lg shadow-gray-100"}/>
                            </div>
                            <div className={"text-lg font-bold truncate"}>{linkElement.site_name}</div>
                            <div
                                className={"text-sm font-light text-gray-400 truncate"}>{linkElement.site_description}</div>
                        </Link>
                    );
                }
                // 对链接内容进行插入
                locationWeb.push(
                    <div className={"grid gap-3"} key={locationElement.id}>
                        <div className={"grid"}>
                            <div className={"flex gap-1 items-center"}>
                                <LinkFilled fontSize={20}/>
                                <div className={"text-xl font-medium"}>{locationElement.display_name}</div>
                            </div>
                            <div className={"text-sm text-gray-500"}>{locationElement.description}</div>
                        </div>
                        <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8"}>
                            {locationLinks}
                        </div>
                    </div>
                );
            }

            setWebReveal(locationWeb); // 设置展示内容

        } catch (err) {
            console.log(err);
        }
    }, [getLink]);

    // 动态修改 document.title
    document.title = `${webInfo.site.site_name} | 友人帐`;

    return (
        <div className={"grid md:rounded-lg md:bg-white md:bg-opacity-50 md:p-6 md:shadow-xl"}>
            {springs.map((spring, index) => (
                <animated.div key={`link-` + index} style={spring}>
                    {webReveal[index]}
                </animated.div>
            ))}
        </div>
    );
}
