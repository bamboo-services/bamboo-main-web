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

import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {LocationGetAdminEntity} from "../../models/entity/location_get_admin_entity.ts";
import {ColorsEntity} from "../../models/entity/color_get_entity.ts";
import {AddLinkAPI, AdminGetColorAPI, AdminGetLocationAPI, EditLinkAPI, GetSingleLinkAPI} from "../../apis/api_link.ts";
import {setToaster} from "../../stores/toaster_store.ts";
import {animated, useSpring, useSprings} from "@react-spring/web";
import noAvatar from "../../assets/images/no_avatar.png";
import defaultBackground from "../../assets/images/default-background.webp";
import {BaseResponse} from "../../models/base_response.ts";
import {InnerLinkDTO} from "../../models/entity/link_get_entity.ts";
import {InfoLabel} from "../info_label.tsx";
import {ColorFilter, Editor, Home, Link, LocalTwo, Mail, NetworkDrive, Pic, Rss, Telegram} from "@icon-park/react";

export function LinkOperateComponent({type}: Readonly<{
    type: "add" | "edit"
}>) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {id} = useParams();

    const [linkAdminOperateDTO, setLinkAdminOperateDTO] = useState<InnerLinkDTO>({
        site_name: "",
        site_url: "",
        site_logo: "",
        site_description: "",
        location: 0,
        color: 0,
        has_adv: false,
        site_rss_url: "",
        remark: "",
        webmaster_email: "",
        service_provider: "",
    } as InnerLinkDTO);
    const [ableSee, setAbleSee] = useState<boolean>(false);
    const [getLocation, setGetLocation] = useState({} as LocationGetAdminEntity);
    const [getColor, setGetColor] = useState({} as ColorsEntity);

    useEffect(() => {
        const funcGetLocation = async () => {
            const getRes = await AdminGetLocationAPI();
            if (getRes?.output === "Success") {
                setGetLocation(getRes.data!);
            } else {
                dispatch(setToaster({
                    title: getRes?.message,
                    message: getRes?.error_message,
                    type: "error",
                }));
            }
        }
        const funcGetColor = async () => {
            const getRes = await AdminGetColorAPI();
            if (getRes?.output === "Success") {
                setGetColor(getRes.data!);
            } else {
                dispatch(setToaster({
                    title: getRes?.message,
                    message: getRes?.error_message,
                    type: "error",
                }));
            }
        }
        funcGetLocation().then();
        funcGetColor().then();
    }, [dispatch]);

    useEffect(() => {
        const func = async () => {
            const getResp = await GetSingleLinkAPI(Number(id));
            if (getResp?.output === "Success") {
                setLinkAdminOperateDTO(getResp.data!);
            } else {
                dispatch(setToaster({
                    type: "error",
                    title: "友链获取失败",
                    message: getResp?.error_message,
                }));
            }
        }
        if (type === "edit") {
            func().then();
        }
    }, [dispatch, id, type]);

    useEffect(() => {
        console.debug("linkAdminOperateDTO", linkAdminOperateDTO);
    }, [linkAdminOperateDTO]);

    useEffect(() => {
        if (linkAdminOperateDTO.site_name && linkAdminOperateDTO.site_url && linkAdminOperateDTO.site_logo && linkAdminOperateDTO.site_description) {
            setAbleSee(true);
        } else {
            setAbleSee(false);
        }
    }, [linkAdminOperateDTO]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // 检查输入数据
        if (linkAdminOperateDTO.site_name === "" || linkAdminOperateDTO.site_name === undefined || linkAdminOperateDTO.site_name === null) {
            dispatch(setToaster({
                title: "出错了",
                message: "站点名字不能为空",
                type: "warning",
            }));
            return;
        }
        if (linkAdminOperateDTO.site_url === "" || linkAdminOperateDTO.site_url === undefined || linkAdminOperateDTO.site_url === null) {
            dispatch(setToaster({
                title: "出错了",
                message: "站点地址不能为空",
                type: "warning",
            }));
            return;
        }
        if (linkAdminOperateDTO.site_logo === "" || linkAdminOperateDTO.site_logo === undefined || linkAdminOperateDTO.site_logo === null) {
            dispatch(setToaster({
                title: "出错了",
                message: "站点图标不能为空",
                type: "warning",
            }));
            return;
        }
        if (linkAdminOperateDTO.site_description === "" || linkAdminOperateDTO.site_description === undefined || linkAdminOperateDTO.site_description === null) {
            dispatch(setToaster({
                title: "出错了",
                message: "站点描述不能为空",
                type: "warning",
            }));
            return;
        }
        if (linkAdminOperateDTO.location === 0 || linkAdminOperateDTO.location === undefined || linkAdminOperateDTO.location === null) {
            dispatch(setToaster({
                title: "出错了",
                message: "请选择展示位置",
                type: "warning",
            }));
            return;
        }
        if (linkAdminOperateDTO.color === 0 || linkAdminOperateDTO.color === undefined || linkAdminOperateDTO.color === null) {
            dispatch(setToaster({
                title: "出错了",
                message: "请选择展示颜色",
                type: "warning",
            }));
            return;
        }
        let getResp: BaseResponse<null> | undefined;
        if (type === "add") {
            getResp = await AddLinkAPI(linkAdminOperateDTO);
        } else {
            getResp = await EditLinkAPI(linkAdminOperateDTO);
        }
        if (getResp?.output === "Success") {
            dispatch(setToaster({
                title: "添加友链成功",
                type: "success",
            }));
            navigate("/admin/link");
        } else {
            dispatch(setToaster({
                title: getResp?.message,
                message: getResp?.error_message,
                type: "error",
            }));
        }
    }

    const [springs] = useSprings(9, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(20px)"},
        delay: index * 25,
        config: {tension: 170, friction: 26},
    }));

    const ableSeeSpring = useSpring({
        opacity: ableSee ? 1 : 0,
        transform: ableSee ? "translateY(0)" : "translateY(-25px)",
        display: ableSee ? "block" : "none",
        config: {tension: 170, friction: 26},
    });

    const moveSpring = useSpring({
        config: {tension: 170, friction: 26},
    });

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-3">
            <div className={"col-span-12 lg:col-span-8"}>
                <div className="grid grid-cols-2 gap-3">
                    <animated.div style={springs[1]}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>站长邮箱</span>
                                <span className={"text-xs text-red-500 opacity-0"}>*</span>
                            </div>
                            <input
                                type="email"
                                placeholder="gm@x-lf.cn"
                                pattern="^(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*|)$"
                                title="邮箱格式不正确"
                                value={linkAdminOperateDTO?.webmaster_email}
                                onChange={(event) => setLinkAdminOperateDTO({
                                    ...linkAdminOperateDTO,
                                    webmaster_email: event.target.value
                                })}
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>（选填）填写后对方可以通过该邮箱自行修改内容或接收通知</span>
                                    </div>
                                }
                                direction={"left"}
                                icon={<Mail theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            邮箱格式不正确
                        </p>
                    </animated.div>
                    <animated.div style={springs[2]}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>服务提供</span>
                                <span className={"text-xs text-red-500 opacity-0"}>*</span>
                            </div>
                            <input
                                type="text"
                                placeholder="阿里云"
                                value={linkAdminOperateDTO?.service_provider}
                                onChange={(event) => setLinkAdminOperateDTO({
                                    ...linkAdminOperateDTO,
                                    service_provider: event.target.value
                                })}
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>对方站点搭建所在的服务提供商（用于备注使用）</span>
                                    </div>
                                }
                                direction={"left"}
                                icon={<NetworkDrive theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                    </animated.div>
                    <animated.div style={springs[3]}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>站点名字</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <input
                                type="text"
                                placeholder="凌中的锋雨"
                                title="请输入站点名称"
                                value={linkAdminOperateDTO?.site_name}
                                onChange={(event) => setLinkAdminOperateDTO({
                                    ...linkAdminOperateDTO,
                                    site_name: event.target.value
                                })}
                                required
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>站点名字，例如：</span>
                                        <b className="text-primary">凌中的锋雨</b>
                                    </div>
                                }
                                icon={<Home theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请输入站点名称
                        </p>
                    </animated.div>
                    <animated.div style={springs[4]}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>站点地址</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <input
                                type="url"
                                placeholder="https://www.x-lf.com/"
                                pattern="^(http|https)://[^\s]*$"
                                title="请输入有效的URL地址"
                                value={linkAdminOperateDTO?.site_url}
                                onChange={(event) => setLinkAdminOperateDTO({
                                    ...linkAdminOperateDTO,
                                    site_url: event.target.value
                                })}
                                required
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>您的站点地址（需包含http/https协议头）：</span>
                                        <a href={"https://www.x-lf.com/"}
                                           className="text-primary hover:underline"
                                           target="_blank"
                                           rel="noreferrer">
                                            https://www.x-lf.com/
                                        </a>
                                    </div>
                                }
                                icon={<Link theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请输入有效的URL地址
                        </p>
                    </animated.div>
                    <animated.div className="col-span-full" style={springs[5]}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>站点图片</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <input
                                type="url"
                                placeholder="https://www.x-lf.com/"
                                pattern="^(http|https)://[^\s]+.(jpg|jpeg|webp|png|ico)(![^\s]+)?$"
                                title="请输入有效的URL地址"
                                value={linkAdminOperateDTO?.site_logo}
                                onChange={(event) => setLinkAdminOperateDTO({
                                    ...linkAdminOperateDTO,
                                    site_logo: event.target.value
                                })}
                                required
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>图片地址支持 PNG/JPG/JPEG/WEBP/ICO 格式</span>
                                        <span>推荐尺寸：256×256 像素</span>
                                    </div>
                                }
                                icon={<Pic theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请输入有效的图片地址
                            <br/>图片地址支持 PNG/JPG/JPEG/WEBP/ICO 格式
                        </p>
                    </animated.div>
                    <animated.div className="col-span-full" style={springs[6]}>
                        <label className="input transition w-full">
                            <div className="label">
                                <span>订阅地址</span>
                                <span className={"text-xs text-red-500 opacity-0"}>*</span>
                            </div>
                            <input
                                type="url"
                                placeholder="https://www.x-lf.com/atom.xml"
                                pattern="^(http|https)://[^\s]*$"
                                title="请输入有效的站点订阅地址"
                                value={linkAdminOperateDTO?.site_rss_url}
                                onChange={(event) => setLinkAdminOperateDTO({
                                    ...linkAdminOperateDTO,
                                    site_rss_url: event.target.value
                                })}
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>Rss/Atom订阅地址（可选）</span>
                                        <a href={"https://blog.x-lf.com/atom.xml"}
                                           className="text-primary hover:underline"
                                           target="_blank"
                                           rel="noreferrer">
                                            https://blog.x-lf.com/atom.xml
                                        </a>
                                    </div>
                                }
                                icon={<Rss theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                    </animated.div>
                    <animated.div className="col-span-full grid" style={springs[7]}>
                        <label className="textarea validator w-full">
                            <div className={"flex items-center space-x-1"}>
                                <InfoLabel
                                    data={
                                        <div className={"grid"}>
                                            <span>用一句话描述您的站点：</span>
                                            <b className="text-primary">不为如何，只为在茫茫人海中有自己的一片天空~</b>
                                        </div>
                                    }
                                    icon={<Editor theme="outline" size="18" fill="#000000"/>}
                                />
                                <div className="label">
                                    <span>站点描述</span>
                                    <span className={"text-xs text-red-500"}>*</span>
                                </div>
                            </div>
                            <textarea
                                placeholder="不为如何，只为在茫茫人海中有自己的一片天空"
                                className="w-full textarea"
                                required
                                value={linkAdminOperateDTO?.site_description}
                                onChange={(event) => setLinkAdminOperateDTO({
                                    ...linkAdminOperateDTO,
                                    site_description: event.target.value
                                })}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请输入站点描述
                        </p>
                    </animated.div>
                    <animated.div className="col-span-full grid" style={springs[8]}>
                        <label className="textarea w-full">
                            <div className={"flex items-center space-x-1"}>
                                <InfoLabel
                                    data={
                                        <div className={"grid"}>
                                            <span>给站长的留言（可选）：</span>
                                            <span className="text-gray-500">（仅站长可见）</span>
                                        </div>
                                    }
                                    icon={<Telegram theme="outline" size="18" fill="#000000"/>}
                                />
                                <div className="label">
                                    <span>备注留言</span>
                                    <span className={"text-xs text-red-500 opacity-0"}>*</span>
                                </div>
                            </div>
                            <textarea
                                placeholder="请输入备注信息"
                                className="w-full textarea"
                                value={linkAdminOperateDTO?.remark}
                                onChange={(event) => setLinkAdminOperateDTO({
                                    ...linkAdminOperateDTO,
                                    remark: event.target.value
                                })}
                            />
                        </label>
                    </animated.div>
                </div>
            </div>

            <div className={"lg:col-span-4 grid gap-3"}>
                <animated.div style={ableSeeSpring}
                              className={"card card-border bg-base-100 card-sm shadow-md"}>
                    <div className="card-body grid gap-1 text-center">
                        <div className={"flex justify-center"}>
                            <img src={linkAdminOperateDTO?.site_logo}
                                 onError={(e) => {
                                     e.currentTarget.src = noAvatar;
                                     e.currentTarget.onerror = null;
                                 }}
                                 alt={""} draggable={false}
                                 className={"rounded-full size-12 lg:size-16 shadow-lg shadow-gray-100"}/>
                        </div>
                        <div className={"text-lg font-bold truncate"}>{linkAdminOperateDTO?.site_name}</div>
                        <div className={"text-sm font-light text-gray-400 line-clamp-1"}>
                            {linkAdminOperateDTO?.site_description}
                        </div>
                    </div>
                </animated.div>

                <animated.div className={"hidden lg:block"} style={{...springs[0], ...moveSpring}}>
                    <div className="card bg-base-100 card-sm shadow-sm">
                        <figure>
                            <img src={defaultBackground} alt={"background-image"}/>
                        </figure>
                        <div className="card-body">
                            <div className={"w-full grid gap-3"}>
                                <div>
                                    <label className="select validator w-full">
                                        <div className="label">
                                            <span>展示位置</span>
                                            <span className={"text-xs text-red-500"}>*</span>
                                        </div>
                                        <select
                                            required
                                            value={linkAdminOperateDTO?.location === 0 ? "" : linkAdminOperateDTO.location}
                                            onChange={(event) =>
                                                setLinkAdminOperateDTO({
                                                    ...linkAdminOperateDTO,
                                                    location: Number(event.target.value)
                                                })}
                                        >
                                            <option value="">请选择颜色</option>
                                            {getLocation.locations?.map((location, index) => (
                                                <option key={"location-" + index} value={location.id}>
                                                    {location.display_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InfoLabel
                                            data={
                                                <div className={"grid"}>
                                                    <span>选择展示位置</span>
                                                </div>
                                            }
                                            icon={<LocalTwo theme="outline" size="18" fill="#000000"/>}
                                        />
                                    </label>
                                    <p className="validator-hint hidden">
                                        请选择展示位置
                                    </p>
                                </div>
                                <div>
                                    <label className="select validator w-full">
                                        <div className="label">
                                            <span>展示颜色</span>
                                            <span className={"text-xs text-red-500"}>*</span>
                                        </div>
                                        <select
                                            required
                                            value={linkAdminOperateDTO?.color === 0 ? "" : linkAdminOperateDTO.color}
                                            onChange={(event) => setLinkAdminOperateDTO({
                                                ...linkAdminOperateDTO,
                                                color: Number(event.target.value)
                                            })}
                                        >
                                            <option value="">请选择位置</option>
                                            {getColor.colors?.map((color, index) => (
                                                <option key={"color-" + index} value={color.id}>
                                                    {color.display_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InfoLabel
                                            data={
                                                <div className={"grid"}>
                                                    <span>选择边框强调色</span>
                                                </div>
                                            }
                                            icon={<ColorFilter theme="outline" size="18" fill="#000000"/>}
                                        />
                                    </label>
                                    <p className="validator-hint hidden">
                                        请选择展示颜色
                                    </p>
                                </div>
                                <div className={"flex justify-end gap-3 col-span-full"}>
                                    <button className={"btn btn-primary "} type={"submit"}>
                                        确认添加
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </animated.div>
            </div>
        </form>
    );
}
