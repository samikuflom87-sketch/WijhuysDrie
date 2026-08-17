<?php
/**
 * Plugin Name: Wijnhuys Drie – maatwerk
 * Description: Site-specifieke functionaliteit voor Wijnhuys Drie, waaronder de NIX18-leeftijdscontrole.
 * Version: 0.1.0
 * Requires PHP: 8.0
 * Text Domain: wijnhuysdrie
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WHD_PLUGIN_VERSION', '0.1.0' );
define( 'WHD_AGE_GATE_COOKIE', 'whd_age_verified' );

/**
 * Simpele zelfverklaring, geen waterdichte controle — maar wel de gangbare
 * praktijk bij Nederlandse alcohol-webshops (vergelijk NIX18-richtlijnen).
 */
function whd_maybe_render_age_gate() {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}
	if ( ! empty( $_COOKIE[ WHD_AGE_GATE_COOKIE ] ) ) {
		return;
	}
	?>
	<div id="whd-age-gate" class="whd-age-gate" role="dialog" aria-modal="true" aria-labelledby="whd-age-gate-title">
		<div class="whd-age-gate__panel">
			<p id="whd-age-gate-title" class="whd-age-gate__title">
				<?php esc_html_e( 'Ben je 18 jaar of ouder?', 'wijnhuysdrie' ); ?>
			</p>
			<p class="whd-age-gate__body">
				<?php esc_html_e( 'Wij verkopen alcoholhoudende dranken. Bevestig dat je 18 jaar of ouder bent om verder te gaan.', 'wijnhuysdrie' ); ?>
			</p>
			<div class="whd-age-gate__actions">
				<button type="button" class="whd-age-gate__yes">
					<?php esc_html_e( 'Ja, ik ben 18 jaar of ouder', 'wijnhuysdrie' ); ?>
				</button>
				<a class="whd-age-gate__no" href="https://www.nix18.nl/">
					<?php esc_html_e( 'Nee, ik ben jonger', 'wijnhuysdrie' ); ?>
				</a>
			</div>
		</div>
	</div>
	<?php
}
add_action( 'wp_body_open', 'whd_maybe_render_age_gate' );

function whd_age_gate_assets() {
	wp_enqueue_style(
		'whd-age-gate',
		plugins_url( 'assets/age-gate.css', __FILE__ ),
		array(),
		WHD_PLUGIN_VERSION
	);

	wp_register_script( 'whd-age-gate', false, array(), WHD_PLUGIN_VERSION, true );
	wp_enqueue_script( 'whd-age-gate' );
	wp_add_inline_script( 'whd-age-gate', whd_age_gate_inline_js() );
}
add_action( 'wp_enqueue_scripts', 'whd_age_gate_assets' );

function whd_age_gate_inline_js() {
	$cookie_name = WHD_AGE_GATE_COOKIE;
	return <<<JS
(function () {
  var gate = document.getElementById('whd-age-gate');
  if (!gate) return;
  document.documentElement.classList.add('whd-age-gate-open');
  var yes = gate.querySelector('.whd-age-gate__yes');
  if (yes) {
    yes.addEventListener('click', function () {
      document.cookie = '{$cookie_name}=1; max-age=' + (60 * 60 * 24 * 30) + '; path=/; samesite=lax';
      gate.remove();
      document.documentElement.classList.remove('whd-age-gate-open');
    });
  }
})();
JS;
}
