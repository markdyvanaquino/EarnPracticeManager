using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using landmarkRemark.Models;

namespace landmarkRemark.Controllers
{
    public class landmarksController : ApiController
    {
        private landmarkEntities db = new landmarkEntities();

        // GET: api/locations
        public List<landmark> Getlandmarks(string searchStr)
        {
            List<landmark> resultLocations = new List<landmark>();
            List<landmark> landmarks = db.landmarks.ToList<landmark>();
            // fill associated userName
            landmarks.ForEach(l => l.userName = db.Users.FirstOrDefault(u => u.Id == l.userId).userName);
            // search notes and username
            if (searchStr != null && searchStr.Trim() != string.Empty)
            {
                foreach(var landmark in db.landmarks)
                {
                    if (landmark.note.ToLower().IndexOf(searchStr.ToLower()) > -1 || landmark.userName.ToLower().IndexOf(searchStr.ToLower()) > -1)
                        {
                        resultLocations.Add(landmark);
                    }
                }
            }
            else
            {
                resultLocations = landmarks;
            }
            //order by username and return list
            return resultLocations.OrderBy(x => x.userName).ToList<landmark>();
        }

        public IQueryable<landmark> GetUserLandmarks(int userId)
        {
            return db.landmarks.Where(l=>l.userId == userId);
        }

        // GET: api/locations/5
        [ResponseType(typeof(landmark))]
        public IHttpActionResult Getlandmark(int id)
        {
            landmark landmark = db.landmarks.Find(id);
            if (landmark == null)
            {
                return NotFound();
            }

            return Ok(landmark);
        }

        // POST: api/locations
        [ResponseType(typeof(landmark))]
        [HttpOptions]
        [HttpPost]
        public IHttpActionResult Postlandmark([FromBody]landmark landmark)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            db.landmarks.Add(landmark);
            db.SaveChanges();
            return CreatedAtRoute("DefaultApi", new { id = landmark.Id }, landmark);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool locationExists(int id)
        {
            return db.landmarks.Count(e => e.Id == id) > 0;
        }
    }
}