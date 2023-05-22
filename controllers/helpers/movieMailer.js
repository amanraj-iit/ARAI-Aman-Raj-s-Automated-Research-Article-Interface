const { MovieDb } = require('moviedb-promise')
const { DailyMovieMailer } = require('./mailer')
const User = require('../../models/users')
const Movie = require('../../models/movies')

const moviedb = new MovieDb(process.env.MOVIE_DB)
const getMovie = () => {
    const randomMovieId = Math.floor( Math.random() * 99999 )
    return new Promise((resolve, reject) => {
        moviedb.movieInfo({ id: randomMovieId })
        .then(data => {
            const { original_title: title, overview, poster_path: img, vote_average:score} = data
            resolve({ title, overview, img, score})
        })
        .catch( err => {
            if(err.response.data.status_code === 34){
               getMovie()
            }else{
                reject(err.response.data)
            }
        })
    })
}
module.exports.movieMailer = async () => {
     try {
        let todayMovie = await getMovie()
        let { title, overview, img, score} = todayMovie

        title = title || "No title"
        overview = overview || "This Research Paper does not have a description"
        img = img ? `https://image.tmdb.org/t/p/original${img}` : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png"
        score =score ? `${score}/10` : "0/10"

        const allSubscribers = await User.find({}).lean().exec()

        const mailAllSubscribers = await Promise.all(allSubscribers.map(async eachSubscriber => await DailyMovieMailer(eachSubscriber.email, title, overview, img, score)))

        const newMovie = new Movie({ "Research Paper Name": title, "CITE Score": score, "The Research Paper image": img, "Research Paper description": overview})
        const movieSaved = await newMovie.save()
        console.log("receiving", todayMovie)
    } catch (error) {
        console.log(error)
    }
}