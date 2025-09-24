using System.ComponentModel.DataAnnotations;

namespace SchoolGeeker.Models
{
    public class SchoolMedia
    {
        [Key]
        public int MediaID { get; set; }
        [Required]
        public int SchoolID { get; set; }
        [Required]
        [StringLength(10)]
        public string MediaType { get; set; }
        [Required]
        [StringLength(255)]
        public string URL { get; set; }

        public School School { get; set; }
    }
}
