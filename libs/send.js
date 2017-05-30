const ok = 'OK';
const err = 'BAD';

/**
 * Wrap for response send.
 * @method send
 * @param  {event.sender} res
 * @param  {string} action
 * @param  {constant} status
 * @param  {*} data
 * @return {response}
 */
let send = (res, action, status, data) => {

	res.send(action, {
		status : status,
		data : data
	});
};

module.exports = {
	/**
	 * Constant for response
	 * @type {ok:string, err: string}
	 */
	constant : {
		ok : ok,
		err : err
	},
	/**
	 * Response Sucess.
	 * @method ok
	 * @param  {event.sender} res
	 * @param  {string} action
	 * @param  {*} data
	 * @return {response}
	 */
	ok : (res, action, data) => send(res, action, ok, data),
	/**
	 * Responce fail.
	 * @method err
	 * @param  {event.sender} res
	 * @param  {string} action
	 * @param  {*} data
	 * @return {response}
	 */
	err : (res, action, data) => send(res, action, err, data)
};
