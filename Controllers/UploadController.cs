using Microsoft.AspNetCore.Mvc;
using Oci.ObjectstorageService;
using Oci.ObjectstorageService.Requests;
using Oci.Common;
using Oci.Common.Auth;

[Route("api/upload/avatar")]
[ApiController]
public class UploadController : ControllerBase
{
  // Oracle Cloud configuration (recommended to put in config file)
  private const string TenancyId = "ocid1.tenancy.oc1..aaaaaaaaiie5rb4gbduebj25fk3zlsf4rnaoj6rk575u4j5umx4s4uq2mywq";
  private const string UserId = "ocid1.user.oc1..aaaaaaaaxfnz3t2wqgbtunw6x7wi7dnsn62kazzgiwv6fvrpvabv26vireaa";
  private const string Fingerprint = "60:8d:6e:b7:7c:c3:a5:d6:cf:e3:5e:76:a2:a8:53:31";
  private const string PrivateKeyPath = "C:\\Oracle_cloud_key\\lijie.lucas@hotmail.com-2025-09-22T05_00_46.821Z.pem";
  private const string BucketName = "SchoolGeeker";
  private const string NamespaceName = "sd2z6nfhfft4";
  private const string Region = "ap-sydney-1";

  [HttpPost]
  public async Task<IActionResult> UploadAvatar()
  {
    var file = Request.Form.Files[0];
    if (file == null || file.Length == 0)
      return BadRequest("No file uploaded");

    // Get user ID (assumed via authentication or parameter)
    var userId = Request.Form["userId"].ToString();
    if (string.IsNullOrEmpty(userId)) userId = "anonymous";
    var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    var ext = Path.GetExtension(file.FileName);
    var fileName = $"avatars_user_upload/avatar_{userId}_{timestamp}{ext}";

    // Read file content
    using var stream = file.OpenReadStream();
    using var ms = new MemoryStream();
    await stream.CopyToAsync(ms);
    ms.Position = 0;

    // Initialize OCI SDK configuration
    var config = ConfigFileReader.ParseDefault();
    var provider = new ConfigFileAuthenticationDetailsProvider(config);
    var client = new ObjectStorageClient(provider);
    client.SetRegion(Region);

    // Upload file to Bucket
    var putObjectRequest = new PutObjectRequest
    {
      NamespaceName = NamespaceName,
      BucketName = BucketName,
      ObjectName = fileName,
      PutObjectBody = ms
    };
    await client.PutObject(putObjectRequest);

    // Build public access URL
    var url = $"https://objectstorage.{Region}.oraclecloud.com/n/{NamespaceName}/b/{BucketName}/o/{fileName}";
    return Ok(new { url });
  }
}