using System.ComponentModel.DataAnnotations;

namespace SchoolGeeker.Models
{
    public class UserReview
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public int SchoolID { get; set; }

        [Required]
        [StringLength(500)]
        public string Comments { get; set; }

        [Required]
        public bool IsLiked { get; set; }

        [Required]
        public bool IsDisliked { get; set; }

        public DateTime? DateSubmitted { get; set; }
    }
}