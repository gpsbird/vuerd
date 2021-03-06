import { schemeCategory10 } from "d3";
import { Command, User } from "../Command";
import { Store } from "../Store";
import { Logger } from "../Logger";
import { getData, getIndex } from "../Helper";

export interface ShareMouse {
  x: number;
  y: number;
}
export function shareMouse(x: number, y: number): Command<"share.mouse"> {
  return {
    type: "share.mouse",
    data: {
      x,
      y,
    },
  };
}
export function executeShareMouse(store: Store, data: ShareMouse, user: User) {
  Logger.debug("executeShareMouse");
  const { userMouseList } = store.shareState;
  const userMouse = getData(userMouseList, user.id);
  if (userMouse) {
    userMouse.name = user.name;
    userMouse.x = data.x;
    userMouse.y = data.y;
    clearTimeout(userMouse._timeoutID);
    userMouse._timeoutID = setTimeout(() => {
      executeShareMouseEnd(store, { id: user.id });
    }, 1000 * 30);
  } else {
    userMouseList.push({
      id: user.id,
      name: user.name,
      color: schemeCategory10[userMouseList.length % 10],
      x: data.x,
      y: data.y,
      _timeoutID: setTimeout(() => {
        executeShareMouseEnd(store, { id: user.id });
      }, 1000 * 30),
    });
  }
}

export interface ShareMouseEnd {
  id: string;
}
export function shareMouseEnd(id: string): Command<"share.mouseEnd"> {
  return {
    type: "share.mouseEnd",
    data: {
      id,
    },
  };
}
export function executeShareMouseEnd(store: Store, data: ShareMouseEnd) {
  Logger.debug("executeShareMouseEnd");
  const { userMouseList } = store.shareState;
  const index = getIndex(userMouseList, data.id);
  if (index !== null) {
    userMouseList.splice(index, 1);
  }
}
