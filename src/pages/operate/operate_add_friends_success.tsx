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

import {Alarm, Info, Success} from "@icon-park/react";
import {useNavigate} from "react-router";
import {animated, useSprings} from "@react-spring/web";

export function OperateAddFriendsSuccess() {
    const navigate = useNavigate();

    const [springs] = useSprings(4, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(10px)"},
        delay: index * 150,
        config: {tension: 100, friction: 26},
    }));

    return (
        <div className={"grid gap-3"}>
            <div className={"flex text-2xl font-bold justify-center"}>
                友链申请
            </div>
            <animated.div style={springs[0]} role="alert" className="alert alert-success alert-soft">
                <Success theme="outline" size="20" className={"text-success"}/>
                <div>您的友链申请已提交，博主在看到申请后尽快审核，请耐心等待！</div>
            </animated.div>
            <animated.div style={springs[1]} role="alert" className="alert alert-warning alert-soft">
                <Alarm theme="outline" size="20" className={"text-warning"}/>
                <div>请确保您是否已经添加本站友链，未提前添加友链的站点概不通过！</div>
            </animated.div>
            <animated.div style={springs[2]} role="alert" className="alert alert-info alert-soft">
                <Info theme="outline" size="20" className={"text-info"}/>
                <div className={"flex flex-col"}>
                    <span>审核通过与否都会向您发送邮件通知，一般最长时间不超过 <span className={"text-red-500 font-bold"}>7</span> 天。</span>
                    <span>如果您在 <span className={"text-red-500 font-bold"}>7</span> 天内未收到邮件通知，请联系博主「<a className={"link-primary"} href={"mailto:gm@x-lf.cn"}>gm@x-lf.cn</a>」。</span>
                    <span>可能博主因为有事情忽略了审核邮件信息(┬＿┬)。</span>
                </div>
            </animated.div>
            <animated.div style={springs[3]} className={"flex justify-center"}>
                <button className="btn btn-outline btn-primary"
                        onClick={() => navigate("/about/friends")}>
                    我已了解，返回友链(*^▽^*)
                </button>
            </animated.div>
        </div>
    );
}
