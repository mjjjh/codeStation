/**
 * 评论对应二级路由
 */

const { validate } = require("validate.js");

const {
  findCommentByPageAndTypeDao,
  addCommentDao,
  deleteCommentDao,
  findIssueCommentByIdDao,
  findBookCommentByIdDao,
} = require("../dao/commentDao");
const {
  findUserByIdDao
} = require("../dao/userDao");

const {findIssueByIdService} = require("./issueService");
const {findBookByIdService} = require("./bookService");
const { commentRule } = require("./rules");
const { ValidationError } = require("../utils/errors");

/**
 * 根据分页查找对应模块评论
 */
module.exports.findCommentByPageAndTypeService = async function (
  commentType,
  pager
) {
  return await findCommentByPageAndTypeDao(commentType, pager);
};

/**
 * 按照分页获取问答模块某一问题对应的评论
 */
module.exports.findIssueCommentByIdService = async function (id, pager) {
  const res = await findIssueCommentByIdDao(id, pager);
    // 如果存在且有userId，获取用户昵称
    if (res) {
      for(item in res.data) {
        if (res.data[item].userId) {
          try {
            const userInfo = await findUserByIdDao(res.data[item].userId);
            if (userInfo) {
              res.data[item].nickname = userInfo.nickname;
              res.data[item].avatar = userInfo.avatar;
            }
          } catch (error) {
            console.error("获取用户昵称失败:", error);
          }
        }
      }
    }
    
    
    return res;
};

/**
 * 按照分页获取书籍模块某一本书对应的评论
 */
module.exports.findBookCommentByIdService = async function (id, pager) {
  return await findBookCommentByIdDao(id, pager);
};

/**
 * 新增评论
 * @param {*} newCommentInfo
 * @returns
 */
module.exports.addCommentService = async function (newCommentInfo) {
  // 首先对数据进行一个处理，补全另一个 id 值为 null
  if (!newCommentInfo.issueId) {
    newCommentInfo.issueId = "";
  } else {
    newCommentInfo.bookId = "";
  }
  
  return validate.async(newCommentInfo, commentRule).then(
    async function () {

      // 评论数加一
      if (newCommentInfo.issueId) {
        const issue = await findIssueByIdService(newCommentInfo.issueId);
        issue.commentNumber += 1;
        await issue.save();
      } else {
        const book = await findBookByIdService(newCommentInfo.bookId);
        book.commentNumber += 1;
        await book.save();
      }
      // 增加评论日期字段
      newCommentInfo.commentDate = new Date().getTime().toString();
      return await addCommentDao(newCommentInfo);
    },
    function (e) {
      console.log(e);
      return new ValidationError("数据验证失败");
    }
  );
};

/**
 * 根据 id 删除评论
 * @param {*} id
 * @returns
 */
module.exports.deleteCommentService = async function (id) {
  return await deleteCommentDao(id);
};
