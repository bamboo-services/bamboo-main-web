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

import {Button, Divider, InfoLabel, Input, Label, Select, Textarea} from "@fluentui/react-components";
import {animated, useSprings} from "@react-spring/web";
import {useEffect, useState} from "react";
import {GetAbleSelectColorAPI} from "../../apis/api_link.ts";
import {ColorAbleSelectEntity} from "../../models/entity/color_able_select_entity.ts";
import {useDispatch} from "react-redux";
import {setToaster} from "../../stores/toaster_store.ts";
import {ToastStore} from "../../models/store/toast_stores.ts";
import {LinkDisplayModule} from "../../models/modules/link_display_module.ts";
import {LinkAddDTO} from "../../models/dto/link_add.ts";

export function OperateAddFriends({emitLinkDisplay}: Readonly<{
    emitLinkDisplay: (data: LinkDisplayModule) => void
}>) {
    const dispatch = useDispatch();

    const [getColor, setGetColor] = useState<ColorAbleSelectEntity>({} as ColorAbleSelectEntity);
    const [linkAdd, setLinkAdd] = useState<LinkAddDTO>({} as LinkAddDTO);

    useEffect(() => {
        const funcAbleSelectLocation = async () => {
            const getResp = await GetAbleSelectColorAPI();
            if (getResp?.output === "Success") {
                setGetColor(getResp.data!);
            } else {
                dispatch(setToaster({
                    title: getResp?.message,
                    message: getResp?.error_message,
                    type: "error",
                } as ToastStore));
            }
        }
        funcAbleSelectLocation().then();
    }, [dispatch]);

    useEffect(() => {
        emitLinkDisplay({
            site_logo: linkAdd.site_logo,
            site_name: linkAdd.site_name,
            site_description: linkAdd.site_description,
        } as LinkDisplayModule);
    }, [emitLinkDisplay, linkAdd.site_description, linkAdd.site_logo, linkAdd.site_name]);

    const [springs] = useSprings(13, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(10px)"},
        delay: index * 50 + 150,
        config: {tension: 100, friction: 26},
    }));

    return (
        <div className={"grid grid-cols-2 gap-3"}>
            <div className={"col-span-full flex text-2xl font-bold justify-center"}>
                友链申请
            </div>
            <animated.div style={springs[0]} className={"grid"}>
                <Label htmlFor={"link-email"} className={"flex space-x-1"}>
                    <span>您的邮箱</span>
                    <span className={"text-xs text-red-500"}>*</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>邮箱是为您发送友链审核通过的通知，不会被公开。</span>
                                <span>并且填写邮箱后续有需要修改友链信息，可直接验证邮箱验证码即可修改站点。</span>
                            </div>
                        }
                    />
                </Label>
                <Input className={"w-full"} id={"link-email"} required
                       onChange={(_, data) => setLinkAdd({...linkAdd, webmaster_email: data.value})}/>
            </animated.div>
            <animated.div style={springs[1]} className={"grid"}>
                <Label htmlFor={"link-provider"} className={"flex space-x-1"}>
                    <span>服务提供商</span>
                    <span className={"text-xs text-red-500"}>*</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>为了保证站点的质量，以及其他用户访问其他站点比较方便，推荐使用大厂服务商。</span>
                                <span>（不影响友链审核，也不会公开，只是希望各位站长可以更好经营自己的站点而写）</span>
                            </div>
                        }
                    />
                </Label>
                <Input className={"w-full"} id={"link-provider"} required
                       onChange={(_, data) => setLinkAdd({...linkAdd, service_provider: data.value})}/>
            </animated.div>
            <animated.div style={springs[2]} className={"grid"}>
                <Label htmlFor={"site-name"} className={"flex space-x-1"}>
                    <span>站点名字</span>
                    <span className={"text-xs text-red-500"}>*</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>您的站点名字，例如：<b>凌中的锋雨</b></span>
                            </div>
                        }
                    />
                </Label>
                <Input className={"w-full"} id={"site-name"} required
                       onChange={(_, data) => setLinkAdd({...linkAdd, site_name: data.value})}/>
            </animated.div>
            <animated.div style={springs[3]} className={"grid"}>
                <Label htmlFor={"site-url"} className={"flex space-x-1"}>
                    <span>站点地址</span>
                    <span className={"text-xs text-red-500"}>*</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>您的站点地址，例如：</span>
                                <a href={"https://www.x-lf.com/"} target={"_blank"}
                                   className={"text-blue-500 hover:text-blue-600 transition"}>
                                    https://www.x-lf.com/
                                </a>
                            </div>
                        }
                    />
                </Label>
                <Input className={"w-full"} id={"site-url"} required
                       onChange={(_, data) => setLinkAdd({...linkAdd, site_url: data.value})}/>
            </animated.div>
            <animated.div style={springs[4]} className={"grid col-span-full"}>
                <Label htmlFor={"site-image-url"} className={"flex space-x-1"}>
                    <span>站点图片地址</span>
                    <span className={"text-xs text-red-500"}>*</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>您的站点首选地址，用作友链展示的图片</span>
                                <span>（支持 gif 动图，浏览器可渲染内容即可）</span>
                            </div>
                        }
                    />
                </Label>
                <Input className={"w-full"} id={"site-image-url"} required
                       onChange={(_, data) => setLinkAdd({...linkAdd, site_logo: data.value})}/>
            </animated.div>
            <animated.div style={springs[5]} className={"grid col-span-full"}>
                <Label htmlFor={"site-rss-url"} className={"flex space-x-1"}>
                    <span>站点订阅地址</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>若您的站点有 RSS 或 ATOM 订阅地址可以填写进入，方便我订阅哦</span>
                                <span>（如果不知道可以不填写）例如：</span>
                                <a href={"https://blog.x-lf.com/atom.xml"} target={"_blank"}
                                   className={"text-blue-500 hover:text-blue-600 transition"}>
                                    https://blog.x-lf.com/atom.xml
                                </a>
                            </div>
                        }
                    />
                </Label>
                <Input className={"w-full"} id={"site-rss-url"}
                       onChange={(_, data) => setLinkAdd({...linkAdd, site_rss_url: data.value})}/>
            </animated.div>
            <animated.div style={springs[6]} className={"grid col-span-full"}>
                <Label htmlFor={"site-description"} className={"flex space-x-1"}>
                    <span>站点描述</span>
                    <span className={"text-xs text-red-500"}>*</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>您的站点一句话描述，用作友链展示使用，例如：</span>
                                <b>不为如何，只为在茫茫人海中有自己的一片天空~</b>
                            </div>
                        }
                    />
                </Label>
                <Textarea className={"w-full"} id={"site-description"} required
                          onChange={(_, data) => setLinkAdd({...linkAdd, site_description: data.value})}/>
            </animated.div>
            <animated.div style={springs[7]} className={"col-span-full pt-3"}>
                <Divider appearance="brand" draggable={false}>站点属性</Divider>
            </animated.div>
            <animated.div style={springs[8]} className={"grid"}>
                <Label htmlFor={"expected-location"} className={"flex space-x-1"}>
                    <span>期望位置</span>
                    <span className={"text-xs text-red-500"}>*</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>您期望您的站点在哪一个位置展示给大家看。</span>
                                <b>（注意，不可选择的代表是特定的）</b>
                            </div>
                        }
                    />
                </Label>
                <Select className={"w-full"} id={"expected-location"} required
                        onChange={(_, data) => setLinkAdd({...linkAdd, desired_location: Number(data.value)})}>
                    <option>Red</option>
                    <option>Green</option>
                    <option>Blue</option>
                </Select>
            </animated.div>
            <animated.div style={springs[9]} className={"grid"}>
                <Label htmlFor={"expected-color"} className={"flex space-x-1"}>
                    <span>期望颜色</span>
                    <span className={"text-xs text-red-500"}>*</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>您可以选择一个颜色展示边框，可以让别人看到更加醒目。</span>
                                <b>（注意，不可选择的代表是特定的）</b>
                            </div>
                        }
                    />
                </Label>
                <Select className={"w-full"} id={"expected-color"} required
                        onChange={(_, data) => setLinkAdd({...linkAdd, desired_color: Number(data.value)})}>
                    {getColor.colors?.map((color, index) => (
                        <option key={"color_" + index} value={color.id}>{color.display_name}</option>
                    ))}
                </Select>
            </animated.div>
            <animated.div style={springs[10]} className={"col-span-full pt-3"}>
                <Divider appearance="brand" draggable={false}>备注信息</Divider>
            </animated.div>
            <animated.div style={springs[11]} className={"grid col-span-full"}>
                <Label htmlFor={"remarks"} className={"flex space-x-1"}>
                    <span>备注</span>
                    <InfoLabel
                        info={
                            <div className={"grid"}>
                                <span>什么都可以写，就是写给我看的</span>
                                <span>（不会被展示出来）</span>
                            </div>
                        }
                    />
                </Label>
                <Textarea className={"w-full"} id={"remarks"}
                          onChange={(_, data) => setLinkAdd({...linkAdd, remark: data.value})}/>
            </animated.div>
            <animated.div style={springs[12]} className={"grid col-span-full w-full justify-center"}>
                <Button appearance={"primary"}>提交申请</Button>
            </animated.div>
        </div>
    );
}
