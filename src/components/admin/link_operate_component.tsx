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
import {useEffect, useState} from "react";
import {LocationGetAdminEntity} from "../../models/entity/location_get_admin_entity.ts";
import {ColorsEntity} from "../../models/entity/color_get_entity.ts";
import {AddLinkAPI, AdminGetColorAPI, AdminGetLocationAPI, EditLinkAPI, GetSingleLinkAPI} from "../../apis/api_link.ts";
import {setToaster} from "../../stores/toaster_store.ts";
import {animated, useSpring, useSprings} from "@react-spring/web";
import {Button, Card, CardFooter, CardPreview, Input, Label, Select, Textarea} from "@fluentui/react-components";
import noAvatar from "../../assets/images/no_avatar.png";
import defaultBackground from "../../assets/images/default-background.webp";
import {BaseResponse} from "../../models/base_response.ts";
import {InnerLinkDTO} from "../../models/entity/link_get_entity.ts";

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

    async function handleSubmit() {
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
        <div className="grid grid-cols-12 gap-3">
            <div className={"col-span-12 lg:col-span-8"}>
                <div className="grid grid-cols-12 gap-4">
                    <animated.div className="col-span-6" style={springs[1]}>
                        <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                            <span>站长邮箱</span>
                        </Label>
                        <Input
                            className={"w-full"}
                            placeholder="请输入站长邮箱"
                            size={"large"}
                            value={linkAdminOperateDTO?.webmaster_email}
                            onChange={(_, data) => {
                                setLinkAdminOperateDTO({...linkAdminOperateDTO, webmaster_email: data.value})
                            }}
                        />
                    </animated.div>
                    <animated.div className="col-span-6" style={springs[2]}>
                        <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                            <span>服务提供商</span>
                        </Label>
                        <Input
                            className={"w-full"}
                            placeholder="请输入服务提供商"
                            size={"large"}
                            value={linkAdminOperateDTO?.service_provider}
                            onChange={(_, data) => {
                                setLinkAdminOperateDTO({...linkAdminOperateDTO, service_provider: data.value})
                            }}
                        />
                    </animated.div>
                    <animated.div className="col-span-6" style={springs[3]}>
                        <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                            <span>站点名字</span>
                            <span className={"text-xs text-red-500"}>*</span>
                        </Label>
                        <Input
                            className={"w-full"}
                            placeholder="请输入站点名字"
                            size={"large"}
                            value={linkAdminOperateDTO?.site_name}
                            onChange={(_, data) => {
                                setLinkAdminOperateDTO({...linkAdminOperateDTO, site_name: data.value})
                            }}
                            required
                        />
                    </animated.div>
                    <animated.div className="col-span-6" style={springs[4]}>
                        <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                            <span>站点地址</span>
                            <span className={"text-xs text-red-500"}>*</span>
                        </Label>
                        <Input
                            className={"w-full"}
                            placeholder="请输入站点地址"
                            required
                            size={"large"}
                            value={linkAdminOperateDTO?.site_url}
                            onChange={(_, data) => {
                                setLinkAdminOperateDTO({...linkAdminOperateDTO, site_url: data.value})
                            }}
                        />
                    </animated.div>
                    <animated.div className="col-span-6" style={springs[5]}>
                        <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                            <span>站点图标</span>
                            <span className={"text-xs text-red-500"}>*</span>
                        </Label>
                        <Input
                            className={"w-full"}
                            placeholder="请输入图标地址"
                            size={"large"}
                            value={linkAdminOperateDTO?.site_logo}
                            onChange={(_, data) => {
                                setLinkAdminOperateDTO({...linkAdminOperateDTO, site_logo: data.value})
                            }}
                        />
                    </animated.div>
                    <animated.div className="col-span-6" style={springs[6]}>
                        <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                            <span>订阅地址</span>
                        </Label>
                        <Input
                            className={"w-full"}
                            placeholder="请输入订阅地址"
                            size={"large"}
                            value={linkAdminOperateDTO?.site_rss_url}
                            onChange={(_, data) => {
                                setLinkAdminOperateDTO({...linkAdminOperateDTO, site_rss_url: data.value})
                            }}
                        />
                    </animated.div>
                    <animated.div className="col-span-12" style={springs[7]}>
                        <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                            <span>站点描述</span>
                            <span className={"text-xs text-red-500"}>*</span>
                        </Label>
                        <Textarea
                            className={"w-full"}
                            placeholder="请输入站点描述"
                            size={"large"}
                            value={linkAdminOperateDTO?.site_description}
                            onChange={(_, data) => {
                                setLinkAdminOperateDTO({...linkAdminOperateDTO, site_description: data.value})
                            }}
                        />
                    </animated.div>
                    <animated.div className="col-span-12" style={springs[8]}>
                        <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                            <span>备注</span>
                        </Label>
                        <Textarea
                            className={"w-full"}
                            placeholder="请输入备注信息"
                            size={"large"}
                            value={linkAdminOperateDTO?.remark}
                            onChange={(_, data) => {
                                setLinkAdminOperateDTO({...linkAdminOperateDTO, remark: data.value})
                            }}
                        />
                    </animated.div>
                </div>
            </div>

            <div className={"lg:col-span-4 grid gap-3"}>
                <animated.div
                    className={"border rounded-md bg-white shadow hover:scale-105 grid gap-1 text-center justify-center p-3"}
                    style={ableSeeSpring}>
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
                    <div
                        className={"text-sm font-light text-gray-400 truncate"}>{linkAdminOperateDTO?.site_description}</div>
                </animated.div>

                <animated.div className={"hidden lg:block"} style={{...springs[0], ...moveSpring}}>
                    <Card className={"m-auto w-full shadow-md rounded-md bg-white"}>
                        <CardPreview>
                            <img
                                className="object-cover w-full h-36"
                                src={defaultBackground}
                                alt="背景图"
                            />
                        </CardPreview>
                        <CardFooter>
                            <div className={"w-full grid grid-cols-2 gap-3"}>
                                <div>
                                    <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                                        <span>展示位置</span>
                                        <span className={"text-xs text-red-500"}>*</span>
                                    </Label>
                                    <Select
                                        className={"w-full"}
                                        required
                                        size={"large"}
                                        value={linkAdminOperateDTO?.location === 0 ? "" : linkAdminOperateDTO.location}
                                        onChange={(_, data) => {
                                            setLinkAdminOperateDTO({...linkAdminOperateDTO, location: Number(data.value)})
                                        }}
                                    >
                                        <option value="">请选择位置</option>
                                        {getLocation.locations?.map((item) => (
                                            <option value={item.id} key={item.id}>{item.display_name}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                                        <span>选择展示颜色</span>
                                        <span className={"text-xs text-red-500"}>*</span>
                                    </Label>
                                    <Select
                                        className={"w-full"}
                                        required
                                        size={"large"}
                                        value={linkAdminOperateDTO?.color === 0 ? "" : linkAdminOperateDTO.color}
                                        onChange={(_, data) => {
                                            setLinkAdminOperateDTO({...linkAdminOperateDTO, color: Number(data.value)})
                                        }}
                                    >
                                        <option value="">默认</option>
                                        {getColor.colors?.map((item) => (
                                            <option value={item.id} key={item.id}>{item.display_name}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div className={"col-span-full"}>
                                    <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                                        <span>是否有广告</span>
                                        <span className={"text-xs text-red-500"}>*</span>
                                    </Label>
                                    <Select
                                        className={"w-full"}
                                        required
                                        size={"large"}
                                        defaultValue={linkAdminOperateDTO?.has_adv ? "1" : "0"}
                                        onChange={(_, data) => {
                                            setLinkAdminOperateDTO({...linkAdminOperateDTO, has_adv: data.value === "1"})
                                        }}
                                    >
                                        <option value={"0"}>否</option>
                                        <option value={"1"}>是</option>
                                    </Select>
                                </div>
                                <div className={"flex justify-end gap-3 col-span-full"}>
                                    <Button
                                        appearance="primary"
                                        size={"large"}
                                        onClick={handleSubmit}
                                    >
                                        确认添加
                                    </Button>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </animated.div>
            </div>
        </div>
    );
}
