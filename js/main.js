$(function () {

    // svg polyfil for svg sprites
    svg4everybody();

    // init custom scrollbars
    $('.js-custom-scrollbar').perfectScrollbar(); 

    //
    // sliders
    //

    $('.h-slider__owl').owlCarousel({
        nav: true,
        dots: true,
        center: true,
        items: 2,
        loop: true,
        margin: 15,
        responsive : {
            576 : {
                items: 3, 
                margin: 25
            }
        }
    });

    //
    // sliders .. end;
    //

    //
	// player
	//

	var $myPlayer = $('#jquery_jplayer');
	var $tmpLastPlayed = 0;

	var arrOfPlaylist = [{
		artist:"Bebe Rexha",
		title:"Souls on Fire",
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-07-Bubble.mp3",
		poster: "../img/slider-album-img.png",
		id: 'track-id-1'
	}];

	var myPlaylist = new jPlayerPlaylist(
	{
		jPlayer: $myPlayer,
		cssSelectorAncestor: "#jp_container"
	},

	arrOfPlaylist,

	{
		useStateClassSkin: true,
		playlistOptions: {
			displayTime: 0,
			addTime: 0,
			removeTime: 0,
			shuffleTime: 0
		},

		play: function(e) {
			setTrackData(e);

			// синхроним классы паузы и играющего итема
			var $playlistCurrent = $('a.jp-playlist-current');
			var $plcID = $playlistCurrent.data('id');

			$('.mustoggler_paused').removeClass('mustoggler_paused');
			$('.mustoggler_playing').removeClass('mustoggler_playing');

			$('[data-musid=' + $plcID + ']').addClass('mustoggler_playing');
		},

		pause: function(e) {
			var $currentPlaying = $('.mustoggler_playing');

			$currentPlaying.addClass('mustoggler_paused');
		},

		ended: function() {
			$tmpLastPlayed = 0;
		},

		loadstart: function(e) {		
			setTrackData(e);
		},

		timeupdate  : function(e){
			//синхроним время песни в плеере с итемом
			var $timeInPlayer = $('.jp-current-time').html();
			var $currenDurDiv = $('.mustoggler_playing').find('.top-tracks__duration');

			$currenDurDiv.html( $timeInPlayer );
		}
	});

	$(".jp-volume-bar").slider({
		range: "min",
		min: 0,
		max: 100,
		value: 100,

		slide: function(event, ui) {
			$myPlayer.jPlayer("volume", ui.value/100);
		}
	});

	$(".jp-track-durbar").slider({
		range: "min",
		min: 0,
		max: 100,
		value: 0,

		slide: function(event, ui) {
			$myPlayer.jPlayer("playHead", ui.value);
		},

		create: function() {
			$myPlayer.jPlayer("option", "cssSelector.seekBar", '.jp-track-durbar');
			$myPlayer.jPlayer("option", "cssSelector.playBar", ".jp-track-durbar .ui-slider-range");
		}
	});

	function setTrackData(e){
		var title = e.jPlayer.status.media.title,
		poster    = e.jPlayer.status.media.poster,
		artist    = e.jPlayer.status.media.artist,
		$trackInfo = $('.jp-track-info');

		$trackInfo.find('.jp-track-info__title-track').text(title);
		$trackInfo.find('.jp-track-info__title-artist').text(artist);
		$trackInfo.find('.jp-track-info__img').css('background-image', 'url("' + poster + '")');
	};

	$('.mustoggler').on('click', function(e){
		e.stopPropagation();
		e.preventDefault();

		var $this = $(this);
		var $musList = $this.closest('.muslist');
		var $musItems = $musList.find('.mustoggler');
		var $playlistItems;
		var arOfData = [];
		var id = $this.data('musid');
		var indexInList = false;
		var currentPlaying = $this.hasClass('mustoggler_playing');
		var currentPlayingAndPause = currentPlaying && $this.hasClass('mustoggler_paused');

		//актив класс на кнопке ините музыки
		$('.mustoggler_playing').removeClass('mustoggler_playing');
		$this.addClass('mustoggler_playing');

		//сбор массива данных
		$musItems.each(function(){
			var $this = $(this);
			var data = $this.data('musmeta');

			arOfData.push(data);
		});

		//добавление трека в лист
		arOfData.forEach(function(el){
			var $playlistItems = $('.jp-playlist-item');
			var arrIDInPlaylist = [];
			var canBeAdded = true;

			//сбор имеющихся айди треков
			$playlistItems.each(function(index, item) {
				arrIDInPlaylist.push( $(item).data('id') );
			});

			// проверка на уникальность
			arrIDInPlaylist.forEach(function(id){
				if ( id == el.id ){
					canBeAdded = false;
				}
			});

			// если уже есть в списке, не добавляем 
			if ( canBeAdded ){
				myPlaylist.add({
					title: el.title,
					artist: el.artist,
					mp3: el.url,
					poster: el.img,
					id: el.id
				});
			};
		});

		$playlistItems = $('.jp-playlist-item');
		indexInList = $playlistItems.filter('[data-id="' + id + '"]').closest('li').index();

		if ( currentPlayingAndPause ) {

			myPlaylist.play();

		} else if ( currentPlaying ){

			myPlaylist.pause();

		} else {

			myPlaylist.select(indexInList);
			myPlaylist.play();

		}
	});

	$('.mustoggler').on('click', 'a, button', function(e){
		e.stopPropagation();
	});

	$('.jsAlbumToggler').on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		var target = $this.data('target');
		var $targetDiv = $('[data-albumlist=' + target + ']:visible');

		$targetDiv.find('.mustoggler').first().click();
	});

	//
	// player ... end;
    //
    
    //
	// mobile menu
	//

	var $menuToggler = $('.menu-toggler');
	var $body = $('body');
	var $menuOverlay = $('.menu-overlay, .xs-menu__close-btn');
	var $menu = $('.header__xs-menu');

	$menuToggler.on('click', function(e){
		e.preventDefault();
		showXsMenu();
	});

	$menuOverlay.on('click', function(e){
		e.preventDefault();
		hideXsMenu();
	});

	function showXsMenu(){
		$body.addClass('body-overflow');
		$menu.addClass('active');
		$menuOverlay.addClass('active');
	};

	function hideXsMenu(){
		$body.removeClass('body-overflow');
		$menu.removeClass('active');
		$menuOverlay.removeClass('active');
	};

	//
	// mobile menu ... end;
    //
    
    //
	// top-tracks item info
	//

	$('.top-tracks__info-toggler').on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		var isMobile = window.matchMedia("(max-width: 767px)").matches;

		if (isMobile){

			var $allInfoMobile = $('.track-xs-info');
			var $mobInfoTogglers = $('.top-tracks__info-toggler');
			var $infoMobile = $this.closest('.top-tracks__item').find('.track-xs-info');

			$mobInfoTogglers.removeClass('active');
			$this.addClass('active');
			$allInfoMobile.hide();
			$infoMobile.show();

		} else {

			var $info = $this.closest('.top-tracks__info');
			var $infoFront = $info.find('.top-tracks__info-front');
			var $infoBack = $info.find('.top-tracks__info-back');

			$infoFront.toggle();
			$infoBack.toggle();

		}
	});

	$('.track-xs-info__close-btn').on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		var $modal = $this.closest('.track-xs-info');
		var $mobInfoTogglers = $('.top-tracks__info-toggler');

		$mobInfoTogglers.removeClass('active')
		$modal.hide();
	});

	//
	// top-tracks item info ... end;
	//

	//
	// custom dropdowns by id
	//

	var $customDrops = $('.custom-dropdown');
	var $customDropsBtns = $('.custom-dropdown-toggler');

	$customDropsBtns.on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		var target = $this.data('target');

		$customDrops.not('#' + target).removeClass('active');
		$customDropsBtns.not($this).removeClass('active');
		$this.toggleClass('active');
		$('#' + target).toggleClass('active');
	});

	$(document).on('click', function(e){
		if ( !$customDrops.is(e.target) && $customDrops.has(e.target).length === 0 && !$customDropsBtns.is(e.target) && $customDropsBtns.has(e.target).length === 0  ) { 
			$customDrops.removeClass('active');
			$customDropsBtns.removeClass('active');
		} 
	});

	$('.dropdown').on('show.bs.dropdown', function () {
		$customDrops.removeClass('active');
		$customDropsBtns.removeClass('active');
	});

	//
	// custom dropdowns by id ... end;
	//

});