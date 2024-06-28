export async function onRequestPost(context) {
  try {
    const file_size_limit = parseInt(context.env.FILE_SIZE_LIMIT_BYTES);
    const req_data = await context.request.formData();
    const file_id = req_data.get('file_id');
    const file = req_data.get('file');
    const file_name = file.name;
    const file_type = file.type;
    const file_size = file.size;
    const file_body = await file.bytes();
    if (file_size > file_size_limit) {
      return Response.json({
        status: 400,
        id: file_id, 
        name: file_name,
        type: file_type,
        size: file_size,
        message: `Aborted. File size is too large. Max size is ${file_size_limit} bytes.`
      });
    } else {
      return Response.json({
        status: 200,
        id: file_id, 
        name: file_name,
        type: file_type,
        size: file_size,
        message: 'OK' 
      });
    }
  } catch (err) {
    return Response.json({
      status: 500,
      message: `${err.message}\n${err.stack}`
    });
  }
}
